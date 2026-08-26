import "server-only";
import writeXlsxFile, {
  type Cell,
  type CellObject,
  type Row,
  type SheetData,
} from "write-excel-file/node";
import {
  DIAGNOSTIC_PROFILES,
  ORIGIN_LABELS,
  type DiagnosticQuestion,
  type DiagnosticSnapshot,
} from "@/server/queries/diagnostic";
import type { SurveyProfileDb } from "@/types/database";

/**
 * Libro de Excel del diagnóstico de entrada.
 *
 * Este archivo se abre delante de aliados y patrocinadores, así que se trata
 * como un entregable de marca y no como un volcado: portada con lo que
 * contiene, una hoja por perfil con las respuestas persona a persona, las
 * tendencias ya calculadas y el cuestionario completo como anexo.
 *
 * Excel no tiene Poppins ni Inter, así que el texto va en Calibri y la marca
 * se sostiene con el color: azul SEP en las cabeceras y amarillo como
 * puntuación —un subrayado, un resalte—, nunca como fondo de párrafo.
 */

const BRAND = {
  blue: "#2E0BE8",
  violet: "#6A0DD9",
  gold: "#FFC629",
  ink: "#12101C",
  graphite: "#3A3550",
  slate: "#6E6A85",
  line: "#E6E4F0",
  tint: "#EFECFE",
  zebra: "#F7F6FC",
  white: "#FFFFFF",
  amberBg: "#FFF6DA",
  amberInk: "#7A5A00",
} as const;

const FONT = "Calibri";
const NO_ANSWER = "Sin responder";
const DATE_FORMAT = "dd/mm/yyyy hh:mm";

/** Columnas de identidad que preceden a las 15 respuestas, con su ancho. */
const IDENTITY_WIDTHS = [5, 26, 30, 14, 18, 26, 24, 18, 17];
const ANSWER_WIDTH = 32;

const INPUT_TYPE_LABELS: Record<string, string> = {
  single: "Opción única",
  multiple: "Opción múltiple",
  scale_1_5: "Escala 1 a 5",
  email: "Correo",
};

export interface WorkbookMeta {
  generatedAt: Date;
  /** Nombre de quien descarga: queda impreso en la portada. */
  generatedBy: string;
}

/* ── Fábricas de celdas ───────────────────────────────────── */

/** Fila-título a todo lo ancho, en azul de marca. */
function banner(text: string, span: number): Row {
  return [
    {
      value: text,
      columnSpan: span,
      fontFamily: FONT,
      fontSize: 15,
      fontWeight: "bold",
      textColor: BRAND.white,
      backgroundColor: BRAND.blue,
      alignVertical: "center",
      indent: 1,
      height: 34,
    },
    ...blanks(span - 1),
  ];
}

function subtitle(text: string, span: number): Row {
  return [
    {
      value: text,
      columnSpan: span,
      fontFamily: FONT,
      fontSize: 10,
      textColor: BRAND.graphite,
      backgroundColor: BRAND.tint,
      alignVertical: "center",
      indent: 1,
      height: 22,
    },
    ...blanks(span - 1),
  ];
}

/** Título de sección: azul, subrayado en amarillo. */
function sectionTitle(text: string): Row {
  return [
    {
      value: text,
      fontFamily: FONT,
      fontSize: 12,
      fontWeight: "bold",
      textColor: BRAND.blue,
      bottomBorderColor: BRAND.gold,
      bottomBorderStyle: "medium",
      alignVertical: "bottom",
      height: 26,
    },
  ];
}

function headerCell(text: string, extra: Partial<CellObject> = {}): Cell {
  return {
    value: text,
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "bold",
    textColor: BRAND.white,
    backgroundColor: BRAND.blue,
    align: "left",
    alignVertical: "center",
    wrap: true,
    borderColor: BRAND.white,
    height: 22,
    ...extra,
  };
}

function textCell(
  value: string | null | undefined,
  rowIndex: number,
  extra: Partial<CellObject> = {},
): Cell {
  return {
    value: value?.trim() || "—",
    fontFamily: FONT,
    fontSize: 10,
    textColor: BRAND.ink,
    backgroundColor: rowIndex % 2 === 0 ? BRAND.white : BRAND.zebra,
    borderColor: BRAND.line,
    alignVertical: "top",
    wrap: true,
    ...extra,
  };
}

function numberCell(value: number, rowIndex: number, extra: Partial<CellObject> = {}): Cell {
  return {
    value,
    type: Number,
    fontFamily: FONT,
    fontSize: 10,
    textColor: BRAND.ink,
    backgroundColor: rowIndex % 2 === 0 ? BRAND.white : BRAND.zebra,
    borderColor: BRAND.line,
    align: "center",
    alignVertical: "top",
    ...extra,
  };
}

/** Celdas ocultas de una combinación: deben ser `null`. */
function blanks(count: number): null[] {
  return Array<null>(Math.max(0, count)).fill(null);
}

function spacerRow(): Row {
  return [{ height: 8 }];
}

/* ── Hoja 1 · Portada ─────────────────────────────────────── */

const SUMMARY_SPAN = 6;

function summarySheet(snapshot: DiagnosticSnapshot, meta: WorkbookMeta): SheetData {
  const { participants, filters } = snapshot;

  const label = (text: string): Cell => ({
    value: text,
    fontFamily: FONT,
    fontSize: 10,
    textColor: BRAND.slate,
  });
  const strong = (text: string, extra: Partial<CellObject> = {}): Cell => ({
    value: text,
    fontFamily: FONT,
    fontSize: 10,
    fontWeight: "bold",
    textColor: BRAND.ink,
    ...extra,
  });

  const datasetLabel =
    filters.dataset === "reales"
      ? "Solo respuestas reales — sin los datos de demostración"
      : "Todas las respuestas, incluidas las de demostración";
  const originLabel =
    filters.origin === "todos" ? "Todos los orígenes" : ORIGIN_LABELS[filters.origin];

  const dates = participants
    .map((participant) => participant.completedAt)
    .filter((date): date is string => Boolean(date))
    .sort();
  const period = dates.length
    ? `${formatDay(new Date(dates[0]))} — ${formatDay(new Date(dates[dates.length - 1]))}`
    : "Sin respuestas con este filtro";

  // Las hojas del libro salen del filtro, no de si hay respuestas: un perfil
  // sin resultados también tiene su hoja, vacía, y el índice debe decirlo.
  const profilesIncluded = DIAGNOSTIC_PROFILES.filter((profile) =>
    filters.profiles.includes(profile.key),
  );

  const index: [string, string][] = [
    ["Resumen", "Esta portada: filtros aplicados, totales y advertencias."],
    ...profilesIncluded.map(
      (profile): [string, string] => [
        profile.sheet,
        `Una fila por persona con sus 15 respuestas — perfil ${profile.label.toLowerCase()}.`,
      ],
    ),
    ["Tendencias", "Distribución de cada opción, calculada sobre estas mismas respuestas."],
    ["Preguntas", "El cuestionario completo: enunciado, opciones y qué valida cada pregunta."],
  ];

  const rows: SheetData = [
    banner("Diagnóstico de entrada · Semillero de Emprendedores Perú", SUMMARY_SPAN),
    subtitle(
      `Generado el ${formatDayTime(meta.generatedAt)} por ${meta.generatedBy}`,
      SUMMARY_SPAN,
    ),
    spacerRow(),

    sectionTitle("Qué contiene este archivo"),
    ...index.map((entry): Row => {
      const [sheet, description] = entry;
      return [
        strong(sheet, { textColor: BRAND.blue }),
        {
          value: description,
          columnSpan: SUMMARY_SPAN - 1,
          fontFamily: FONT,
          fontSize: 10,
          textColor: BRAND.graphite,
        },
        ...blanks(SUMMARY_SPAN - 2),
      ];
    }),
    spacerRow(),

    sectionTitle("Filtros aplicados"),
    [label("Conjunto de datos"), strong(datasetLabel)],
    [label("Origen"), strong(originLabel)],
    [label("Perfiles"), strong(profileFilterLabel(filters.profiles))],
    [label("Búsqueda"), strong(filters.search.trim() || "Sin filtro de texto")],
    [label("Periodo cubierto"), strong(period)],
    spacerRow(),

    sectionTitle("Totales"),
    [
      headerCell("Perfil"),
      headerCell("Encuestas", { align: "center" }),
      headerCell("Feria · Apoya hoy", { align: "center" }),
      headerCell("Cuenta SEP", { align: "center" }),
      headerCell("Público", { align: "center" }),
      headerCell("Última respuesta", { align: "center" }),
    ],
  ];

  profilesIncluded.forEach((profile, position) => {
    const mine = participants.filter((participant) => participant.profile === profile.key);
    const last = mine
      .map((participant) => participant.completedAt)
      .filter((date): date is string => Boolean(date))
      .sort()
      .at(-1);

    rows.push([
      textCell(`${profile.emoji} ${profile.label}`, position),
      numberCell(mine.length, position, { fontWeight: "bold" }),
      numberCell(mine.filter((participant) => participant.origin === "feria").length, position),
      numberCell(mine.filter((participant) => participant.origin === "cuenta").length, position),
      numberCell(mine.filter((participant) => participant.origin === "publico").length, position),
      textCell(last ? formatDay(new Date(last)) : "—", position, { align: "center" }),
    ]);
  });

  const totalCell = (value: string | number): Cell => ({
    value,
    type: typeof value === "number" ? Number : String,
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: "bold",
    textColor: BRAND.white,
    backgroundColor: BRAND.violet,
    borderColor: BRAND.white,
    align: typeof value === "number" ? "center" : "left",
  });

  rows.push([
    totalCell("Total"),
    totalCell(participants.length),
    totalCell(participants.filter((participant) => participant.origin === "feria").length),
    totalCell(participants.filter((participant) => participant.origin === "cuenta").length),
    totalCell(participants.filter((participant) => participant.origin === "publico").length),
    { backgroundColor: BRAND.violet, borderColor: BRAND.white },
  ]);

  const notes: string[] = [];
  if (snapshot.demoExcluded > 0) {
    notes.push(
      `Se dejaron fuera ${snapshot.demoExcluded} encuestas del ecosistema de demostración (correos @demo.sep.pe). Aquí solo hay respuestas reales.`,
    );
  }
  if (snapshot.truncated) {
    notes.push(
      "Se alcanzó el tope de 5000 encuestas por descarga: filtra por perfil u origen para obtener el resto.",
    );
  }
  notes.push(
    "Contiene datos personales protegidos por la Ley 29733. Compártelo solo con quien lo necesita y no lo publiques.",
  );

  rows.push(spacerRow(), sectionTitle("Notas"));
  for (const note of notes) {
    rows.push([
      {
        value: note,
        columnSpan: SUMMARY_SPAN,
        fontFamily: FONT,
        fontSize: 10,
        fontStyle: "italic",
        textColor: BRAND.slate,
        wrap: true,
        height: 30,
      },
      ...blanks(SUMMARY_SPAN - 1),
    ]);
  }

  return rows;
}

/* ── Hojas 2-4 · Una por perfil ───────────────────────────── */

interface ParticipantsSheet {
  data: SheetData;
  /** 1-indexado, para las reglas de formato condicional. */
  firstAnswerColumn: number;
  answerColumns: number;
  firstDataRow: number;
  lastDataRow: number;
}

function participantsSheet(
  profileKey: SurveyProfileDb,
  snapshot: DiagnosticSnapshot,
  meta: WorkbookMeta,
): ParticipantsSheet {
  const profile = DIAGNOSTIC_PROFILES.find((item) => item.key === profileKey)!;
  const questions = snapshot.questions
    .filter((question) => question.profile === profileKey)
    .sort((a, b) => a.number - b.number);
  const people = snapshot.participants.filter(
    (participant) => participant.profile === profileKey,
  );

  const identityHeaders = [
    "#",
    "Participante",
    "Correo",
    "Teléfono",
    "Región",
    profile.organizationHeader,
    "Situación / especialidad",
    "Origen",
    "Completado",
  ];
  const span = identityHeaders.length + questions.length;

  const data: SheetData = [
    banner(`${profile.emoji} ${profile.label} · Diagnóstico de entrada`, span),
    subtitle(
      `${people.length} ${people.length === 1 ? "respuesta completa" : "respuestas completas"} · Generado el ${formatDayTime(meta.generatedAt)}`,
      span,
    ),
    spacerRow(),
    // Cabecera en dos pisos: arriba el código corto, abajo el enunciado.
    [
      ...identityHeaders.map((header) => headerCell(header, { rowSpan: 2 })),
      ...questions.map((question) =>
        headerCell(`P${question.number}`, {
          backgroundColor: BRAND.violet,
          align: "center",
        }),
      ),
    ],
    [
      ...blanks(identityHeaders.length),
      ...questions.map((question) =>
        headerCell(question.question, {
          backgroundColor: BRAND.violet,
          fontWeight: undefined,
          fontSize: 9,
          alignVertical: "top",
          height: 64,
        }),
      ),
    ],
  ];

  const firstDataRow = data.length + 1;

  people.forEach((person, position) => {
    data.push([
      numberCell(position + 1, position, { textColor: BRAND.slate }),
      textCell(person.name, position, { fontWeight: "bold" }),
      textCell(person.email ?? "Sin correo · participación de feria", position, {
        textColor: person.email ? BRAND.ink : BRAND.slate,
      }),
      textCell(person.phone, position),
      textCell(person.region, position),
      textCell(person.organization, position),
      textCell(person.situation, position),
      textCell(ORIGIN_LABELS[person.origin], position),
      person.completedAt
        ? {
            value: new Date(person.completedAt),
            type: Date,
            format: DATE_FORMAT,
            fontFamily: FONT,
            fontSize: 10,
            textColor: BRAND.graphite,
            backgroundColor: position % 2 === 0 ? BRAND.white : BRAND.zebra,
            borderColor: BRAND.line,
            align: "center",
            alignVertical: "top",
          }
        : textCell("—", position, { align: "center" }),
      ...questions.map((question) => {
        const answer = person.answers[question.number] ?? [];
        return textCell(answer.length ? answer.join(" · ") : NO_ANSWER, position);
      }),
    ]);
  });

  return {
    data,
    firstAnswerColumn: identityHeaders.length + 1,
    answerColumns: questions.length,
    firstDataRow,
    lastDataRow: Math.max(firstDataRow, data.length),
  };
}

/* ── Hoja 5 · Tendencias ──────────────────────────────────── */

const TRENDS_SPAN = 8;
const TRENDS_HEADER_ROWS = 4;

function trendsSheet(snapshot: DiagnosticSnapshot, meta: WorkbookMeta): SheetData {
  const data: SheetData = [
    banner("Tendencias · Distribución de las respuestas", TRENDS_SPAN),
    subtitle(
      `Calculado sobre las ${snapshot.participants.length} encuestas de este archivo · ${formatDayTime(meta.generatedAt)}`,
      TRENDS_SPAN,
    ),
    spacerRow(),
    [
      headerCell("Perfil"),
      headerCell("N°", { align: "center" }),
      headerCell("Pregunta"),
      headerCell("Etiqueta"),
      headerCell("Clave", { align: "center" }),
      headerCell("Opción"),
      headerCell("Respuestas", { align: "center" }),
      headerCell("%", { align: "center" }),
    ],
  ];

  // Bandeamos por pregunta y no por fila: así cada bloque de opciones se lee
  // como una unidad, tenga tres filas o nueve.
  let band = 0;
  let previousQuestion = "";

  for (const trend of snapshot.trends) {
    const key = `${trend.profile}-${trend.number}`;
    if (key !== previousQuestion) {
      band += 1;
      previousQuestion = key;
    }

    const base: Partial<CellObject> = {
      fontFamily: FONT,
      fontSize: 10,
      textColor: BRAND.ink,
      backgroundColor: band % 2 === 0 ? BRAND.zebra : BRAND.white,
      borderColor: BRAND.line,
      alignVertical: "top",
      wrap: true,
    };

    data.push([
      { ...base, value: profileLabel(trend.profile) },
      { ...base, value: trend.number, type: Number, align: "center", wrap: false },
      { ...base, value: trend.question },
      { ...base, value: trend.tag ?? "—", textColor: BRAND.slate },
      { ...base, value: trend.isKey ? "Sí" : "—", align: "center", wrap: false },
      { ...base, value: trend.option },
      { ...base, value: trend.votes, type: Number, align: "center", wrap: false },
      {
        ...base,
        value: trend.pct / 100,
        type: Number,
        format: "0.0%",
        align: "center",
        wrap: false,
        fontWeight: "bold",
      },
    ]);
  }

  return data;
}

/* ── Hoja 6 · El cuestionario ─────────────────────────────── */

const QUESTIONS_SPAN = 8;

function questionsSheet(questions: DiagnosticQuestion[], meta: WorkbookMeta): SheetData {
  const data: SheetData = [
    banner("Cuestionario · 15 preguntas por perfil", QUESTIONS_SPAN),
    subtitle(`Versión vigente al ${formatDayTime(meta.generatedAt)}`, QUESTIONS_SPAN),
    spacerRow(),
    [
      headerCell("Perfil"),
      headerCell("N°", { align: "center" }),
      headerCell("Bloque"),
      headerCell("Pregunta"),
      headerCell("Tipo"),
      headerCell("Opciones"),
      headerCell("Qué valida"),
      headerCell("Clave", { align: "center" }),
    ],
  ];

  questions.forEach((question, position) => {
    data.push([
      textCell(profileLabel(question.profile), position),
      numberCell(question.number, position),
      textCell(question.blockTitle ?? `Bloque ${question.block}`, position),
      textCell(question.question, position, { fontWeight: "bold" }),
      textCell(INPUT_TYPE_LABELS[question.inputType] ?? question.inputType, position),
      textCell(question.options.join("\n") || "—", position),
      textCell(question.validates, position, { textColor: BRAND.slate }),
      textCell(question.isKey ? "Sí" : "—", position, { align: "center" }),
    ]);
  });

  return data;
}

/* ── Ensamblado ───────────────────────────────────────────── */

export async function buildDiagnosticWorkbook(
  snapshot: DiagnosticSnapshot,
  meta: WorkbookMeta,
): Promise<Buffer> {
  const profilesPresent = DIAGNOSTIC_PROFILES.filter((profile) =>
    snapshot.filters.profiles.includes(profile.key),
  );

  const sheets = [
    {
      data: summarySheet(snapshot, meta),
      sheet: "Resumen",
      columns: [
        { width: 28 },
        { width: 26 },
        { width: 20 },
        { width: 16 },
        { width: 14 },
        { width: 20 },
      ],
      showGridLines: false,
    },

    ...profilesPresent.map((profile) => {
      const sheet = participantsSheet(profile.key, snapshot, meta);

      return {
        data: sheet.data,
        sheet: profile.sheet,
        columns: [
          ...IDENTITY_WIDTHS.map((width) => ({ width })),
          ...Array.from({ length: sheet.answerColumns }, () => ({ width: ANSWER_WIDTH })),
        ],
        // Solo filas: un panel vertical partiría el título combinado en dos.
        stickyRowsCount: 5,
        showGridLines: false,
        // Las preguntas sin responder saltan a la vista en ámbar.
        conditionalFormatting: [
          {
            cellRange: {
              from: { row: sheet.firstDataRow, column: sheet.firstAnswerColumn },
              to: {
                row: sheet.lastDataRow,
                column: sheet.firstAnswerColumn + sheet.answerColumns - 1,
              },
            },
            condition: { operator: "=" as const, value: NO_ANSWER },
            style: { backgroundColor: BRAND.amberBg, textColor: BRAND.amberInk },
          },
        ],
      };
    }),

    {
      data: trendsSheet(snapshot, meta),
      sheet: "Tendencias",
      columns: [
        { width: 18 },
        { width: 6 },
        { width: 46 },
        { width: 22 },
        { width: 8 },
        { width: 40 },
        { width: 13 },
        { width: 10 },
      ],
      stickyRowsCount: TRENDS_HEADER_ROWS,
      showGridLines: false,
      // La opción dominante de cada pregunta se resalta sola.
      conditionalFormatting: [
        {
          cellRange: {
            from: { row: TRENDS_HEADER_ROWS + 1, column: TRENDS_SPAN },
            to: {
              row: Math.max(TRENDS_HEADER_ROWS + 1, snapshot.trends.length + TRENDS_HEADER_ROWS),
              column: TRENDS_SPAN,
            },
          },
          condition: { operator: ">=" as const, value: 0.4 },
          style: {
            backgroundColor: BRAND.tint,
            textColor: BRAND.blue,
            fontWeight: "bold" as const,
          },
        },
      ],
    },

    {
      data: questionsSheet(snapshot.questions, meta),
      sheet: "Preguntas",
      columns: [
        { width: 18 },
        { width: 6 },
        { width: 24 },
        { width: 52 },
        { width: 16 },
        { width: 46 },
        { width: 46 },
        { width: 8 },
      ],
      stickyRowsCount: 4,
      showGridLines: false,
    },
  ];

  return writeXlsxFile(sheets, { fontFamily: FONT, fontSize: 11 }).toBuffer();
}

/** `SEP-Diagnostico-Universitarios-2026-08-26.xlsx` */
export function diagnosticFileName(profiles: SurveyProfileDb[], generatedAt: Date): string {
  const scope =
    profiles.length === 1
      ? DIAGNOSTIC_PROFILES.find((profile) => profile.key === profiles[0])?.sheet ?? "Diagnostico"
      : "Todos-los-perfiles";

  const stamp = [
    generatedAt.getFullYear(),
    String(generatedAt.getMonth() + 1).padStart(2, "0"),
    String(generatedAt.getDate()).padStart(2, "0"),
  ].join("-");

  return `SEP-Diagnostico-${scope}-${stamp}.xlsx`;
}

/* ── Formato ──────────────────────────────────────────────── */

function profileLabel(profile: SurveyProfileDb): string {
  return DIAGNOSTIC_PROFILES.find((item) => item.key === profile)?.label ?? profile;
}

function profileFilterLabel(profiles: SurveyProfileDb[]): string {
  if (profiles.length >= DIAGNOSTIC_PROFILES.length) return "Los tres perfiles";
  return profiles.map(profileLabel).join(", ") || "Los tres perfiles";
}

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(date);
}

function formatDayTime(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  }).format(date);
}
