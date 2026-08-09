/**
 * Tipos de la base de datos.
 *
 * ⚠️ Este archivo es un ESQUELETO escrito a mano para que el proyecto compile
 * antes de tener un proyecto de Supabase enlazado. En cuanto exista, se
 * reemplaza por completo con:
 *
 *     supabase gen types typescript --linked > src/types/database.ts
 *
 * No editar a mano una vez generado.
 */

import type {
  UserRole,
  VolunteerType,
  InstitutionType,
} from "./roles";

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type CourseStatusDb = "borrador" | "proximamente" | "disponible" | "archivado";
export type CourseAudienceDb = "universitario" | "docente" | "escolar" | "general";
export type EnrollmentStatusDb = "activo" | "completado" | "abandonado" | "expulsado";
export type SessionStatusDb = "programada" | "en_vivo" | "finalizada" | "cancelada";
export type CertificateKindDb =
  | "sep"
  | "internacional"
  | "voluntariado"
  | "speaker"
  | "participacion";
export type CertificateStatusDb = "pendiente" | "pagado" | "emitido" | "revocado";
export type PaymentMethodDb =
  | "yape"
  | "plin"
  | "culqi_card"
  | "transferencia"
  | "gratuito";
export type PaymentStatusDb =
  | "pendiente"
  | "en_revision"
  | "pagado"
  | "rechazado"
  | "reembolsado";
export type ApplicationStatusDb =
  | "recibida"
  | "en_revision"
  | "entrevista"
  | "aprobada"
  | "rechazada";
export type WorkshopStatusDb = "solicitado" | "confirmado" | "realizado" | "cancelado";
export type SurveyProfileDb = "universitario" | "docente" | "empresa";

interface Table<Row, Insert = Partial<Row>, Update = Partial<Row>> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

/** Forma de retorno de `admin_dashboard()` (migración 0009). */
export interface AdminDashboard {
  users: number;
  users_30d: number;
  enrollments: number;
  completions: number;
  certificates: number;
  revenue_cents: number;
  pending_payments: number;
  pending_apps: number;
  pending_schools: number;
  pending_speakers: number;
  schools: number;
  workshops: number;
  students_reached: number;
  volunteers: number;
  newsletter: number;
  diagnostic_leads: number;
  donations_cents: number;
  regions: number;
}

/** Forma de retorno de `institution_impact_report()` (migración 0009). */
export interface InstitutionImpactReport {
  institution: {
    name: string;
    type: InstitutionType;
    region: string;
    province: string | null;
    agreement_signed_at: string | null;
  } | null;
  workshops_total: number;
  workshops_done: number;
  students_reached: number;
  certificates_issued: number;
  facilitators: number;
  timeline: {
    title: string;
    date: string | null;
    students: number | null;
    status: WorkshopStatusDb;
  }[];
  sdg: { goal: number; name: string }[];
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<{
        id: string;
        full_name: string;
        email: string;
        avatar_url: string | null;
        phone: string | null;
        birth_date: string | null;
        region: string | null;
        province: string | null;
        country: string;
        bio: string | null;
        university: string | null;
        career: string | null;
        study_cycle: string | null;
        current_situation: string | null;
        linkedin_url: string | null;
        instagram_url: string | null;
        institution_id: string | null;
        interests: string[];
        onboarding_done: boolean;
        newsletter_opt_in: boolean;
        terms_accepted_at: string | null;
        privacy_accepted_at: string | null;
        last_seen_at: string | null;
        created_at: string;
        updated_at: string;
      }>;

      user_roles: Table<{
        id: string;
        user_id: string;
        role: UserRole;
        granted_by: string | null;
        granted_at: string;
        revoked_at: string | null;
      }>;

      institutions: Table<{
        id: string;
        name: string;
        type: InstitutionType;
        ruc: string | null;
        region: string;
        province: string | null;
        district: string | null;
        address: string | null;
        contact_name: string | null;
        contact_role: string | null;
        contact_email: string | null;
        contact_phone: string | null;
        website: string | null;
        students_count: number | null;
        logo_url: string | null;
        is_verified: boolean;
        agreement_signed_at: string | null;
        agreement_url: string | null;
        notes: string | null;
        created_by: string | null;
        created_at: string;
      }>;

      courses: Table<{
        id: string;
        slug: string;
        title: string;
        subtitle: string | null;
        description: string | null;
        audience: CourseAudienceDb;
        level: "basico" | "intermedio" | "avanzado";
        status: CourseStatusDb;
        category: string | null;
        total_hours: number;
        sessions_count: number;
        weeks: number;
        frequency: string | null;
        is_free: boolean;
        price_cents: number;
        cover_url: string | null;
        capacity: number | null;
        order_index: number;
        published_at: string | null;
        created_at: string;
      }>;

      course_sessions: Table<{
        id: string;
        course_id: string;
        number: number;
        week: number;
        title: string;
        subtitle: string | null;
        description: string | null;
        duration_min: number;
        scheduled_at: string | null;
        meet_url: string | null;
        recording_url: string | null;
        materials: Json;
        status: SessionStatusDb;
      }>;

      enrollments: Table<{
        id: string;
        user_id: string;
        course_id: string;
        cohort: string | null;
        status: EnrollmentStatusDb;
        progress_pct: number;
        enrolled_at: string;
        completed_at: string | null;
      }>;

      session_progress: Table<{
        id: string;
        enrollment_id: string;
        session_id: string;
        attended: boolean;
        completed_at: string | null;
      }>;

      certificate_types: Table<{
        id: string;
        kind: CertificateKindDb;
        name: string;
        issuer: string;
        price_cents: number;
        description: string | null;
        is_active: boolean;
      }>;

      certificates: Table<{
        id: string;
        user_id: string;
        enrollment_id: string | null;
        certificate_type_id: string;
        verification_code: string;
        status: CertificateStatusDb;
        issued_at: string | null;
        pdf_url: string | null;
        revoked_at: string | null;
        revoked_reason: string | null;
        issued_by: string | null;
        created_at: string;
      }>;

      orders: Table<{
        id: string;
        user_id: string;
        item_type: string;
        item_id: string | null;
        amount_cents: number;
        currency: string;
        status: PaymentStatusDb;
        institution_id: string | null;
        created_at: string;
      }>;

      payments: Table<{
        id: string;
        order_id: string;
        method: PaymentMethodDb;
        amount_cents: number;
        status: PaymentStatusDb;
        provider_ref: string | null;
        voucher_url: string | null;
        operation_code: string | null;
        paid_at: string | null;
        reviewed_by: string | null;
        reviewed_at: string | null;
        reject_reason: string | null;
        created_at: string;
      }>;

      membership_plans: Table<{
        id: string;
        slug: string;
        name: string;
        duration_months: number;
        price_cents: number;
        benefits: Json;
        is_active: boolean;
        order_index: number;
      }>;

      memberships: Table<{
        id: string;
        user_id: string;
        plan_id: string;
        status: "activa" | "vencida" | "cancelada";
        starts_at: string;
        ends_at: string;
        order_id: string | null;
      }>;

      volunteer_roles: Table<{
        id: string;
        slug: string;
        name: string;
        type: VolunteerType;
        description: string | null;
        requirements: Json;
        benefits: Json;
        hours_per_week: number | null;
        open_positions: number;
        is_open: boolean;
      }>;

      volunteer_applications: Table<{
        id: string;
        user_id: string | null;
        volunteer_role_id: string;
        full_name: string;
        email: string;
        phone: string | null;
        region: string | null;
        university: string | null;
        career_cycle: string | null;
        motivation: string | null;
        completed_courses: string | null;
        status: ApplicationStatusDb;
        reviewer_notes: string | null;
        reviewed_by: string | null;
        created_at: string;
      }>;

      volunteer_profiles: Table<{
        id: string;
        user_id: string;
        type: VolunteerType;
        started_at: string;
        hours_committed: number | null;
        is_active: boolean;
      }>;

      volunteer_hours: Table<{
        id: string;
        user_id: string;
        date: string;
        hours: number;
        activity: string;
        approved_by: string | null;
        approved_at: string | null;
      }>;

      mentorships: Table<{
        id: string;
        mentor_id: string;
        mentee_id: string;
        course_id: string | null;
        started_at: string;
        ended_at: string | null;
        notes: string | null;
      }>;

      speaker_profiles: Table<{
        id: string;
        user_id: string | null;
        full_name: string;
        email: string;
        country: string;
        region: string | null;
        expertise: string | null;
        topics: string[];
        story: string | null;
        opportunities: string | null;
        talk_experience: string | null;
        availability: string | null;
        linkedin_url: string | null;
        photo_url: string | null;
        is_approved: boolean;
        is_public: boolean;
        created_at: string;
      }>;

      speaker_invitations: Table<{
        id: string;
        speaker_id: string;
        event_id: string | null;
        topic: string | null;
        proposed_at: string | null;
        status: string;
        created_at: string;
      }>;

      school_applications: Table<{
        id: string;
        school_name: string;
        region: string;
        province: string | null;
        director_name: string;
        contact_phone: string;
        contact_email: string;
        students_3to5: number | null;
        expectations: string | null;
        status: ApplicationStatusDb;
        institution_id: string | null;
        reviewed_by: string | null;
        created_at: string;
      }>;

      workshops: Table<{
        id: string;
        institution_id: string;
        title: string;
        topic: string | null;
        scheduled_at: string | null;
        modality: string;
        grade: string | null;
        students_count: number | null;
        status: WorkshopStatusDb;
        requested_by: string | null;
        created_at: string;
      }>;

      workshop_attendees: Table<{
        id: string;
        workshop_id: string;
        student_name: string;
        grade: string | null;
        attended: boolean;
        certificate_id: string | null;
      }>;

      posts: Table<{
        id: string;
        user_id: string;
        course_id: string | null;
        content: string;
        media_urls: string[];
        is_pinned: boolean;
        is_hidden: boolean;
        likes_count: number;
        created_at: string;
      }>;

      comments: Table<{
        id: string;
        post_id: string;
        user_id: string;
        content: string;
        is_hidden: boolean;
        created_at: string;
      }>;

      post_likes: Table<{
        post_id: string;
        user_id: string;
      }>;

      workshop_facilitators: Table<{
        workshop_id: string;
        user_id: string;
      }>;

      job_queue: Table<{
        id: string;
        kind: string;
        payload: Json;
        status: "pending" | "processing" | "done" | "failed";
        attempts: number;
        last_error: string | null;
        run_after: string;
        created_at: string;
        completed_at: string | null;
      }>;

      events: Table<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        kind: string | null;
        starts_at: string;
        ends_at: string | null;
        location: string | null;
        is_online: boolean;
        meet_url: string | null;
        capacity: number | null;
        cover_url: string | null;
        is_published: boolean;
      }>;

      event_registrations: Table<{
        id: string;
        event_id: string;
        user_id: string | null;
        email: string | null;
        attended: boolean;
        created_at: string;
      }>;

      projects: Table<{
        id: string;
        user_id: string;
        course_id: string | null;
        title: string;
        problem: string | null;
        solution: string | null;
        region: string | null;
        cover_url: string | null;
        is_public: boolean;
        created_at: string;
      }>;

      survey_questions: Table<{
        id: string;
        profile: SurveyProfileDb;
        block: number;
        block_title: string | null;
        number: number;
        question: string;
        input_type: "single" | "multiple" | "scale_1_5" | "email";
        options: Json;
        validates: string | null;
        tag: string | null;
        is_key: boolean;
      }>;

      survey_leads: Table<{
        id: string;
        email: string;
        profile: SurveyProfileDb;
        region: string | null;
        utm_source: string | null;
        completed: boolean;
        created_at: string;
      }>;

      survey_responses: Table<{
        id: string;
        lead_id: string;
        question_id: string;
        answer: Json;
        created_at: string;
      }>;

      newsletter_subscribers: Table<{
        id: string;
        email: string;
        full_name: string | null;
        region: string | null;
        source: string | null;
        is_confirmed: boolean;
        confirmed_at: string | null;
        unsubscribed_at: string | null;
        created_at: string;
      }>;

      donations: Table<{
        id: string;
        donor_name: string | null;
        donor_email: string | null;
        amount_cents: number;
        currency: string;
        is_recurring: boolean;
        cause: string | null;
        method: PaymentMethodDb;
        status: PaymentStatusDb;
        provider_ref: string | null;
        is_anonymous: boolean;
        created_at: string;
      }>;

      partners: Table<{
        id: string;
        name: string;
        logo_url: string | null;
        website: string | null;
        category: string | null;
        order_index: number;
        is_active: boolean;
      }>;

      blog_posts: Table<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        content_mdx: string | null;
        cover_url: string | null;
        author_id: string | null;
        tags: string[];
        published_at: string | null;
        is_published: boolean;
      }>;

      notifications: Table<{
        id: string;
        user_id: string;
        kind: string;
        title: string;
        body: string | null;
        link: string | null;
        read_at: string | null;
        created_at: string;
      }>;

      audit_log: Table<{
        id: number;
        actor_id: string | null;
        action: string;
        entity: string;
        entity_id: string | null;
        before_data: Json | null;
        after_data: Json | null;
        ip: string | null;
        user_agent: string | null;
        created_at: string;
      }>;
    };
    /** Vistas de analítica (migración 0009). Solo lectura. */
    Views: {
      course_stats: Table<{
        id: string;
        slug: string;
        title: string;
        status: CourseStatusDb;
        audience: CourseAudienceDb;
        category: string | null;
        sessions_count: number;
        enrollments: number;
        completions: number;
        avg_progress: number;
        completion_rate: number;
      }>;
      region_stats: Table<{
        region: string;
        users: number;
        students: number;
        teachers: number;
        mentors: number;
      }>;
      certificate_stats: Table<{
        id: string;
        name: string;
        issuer: string;
        price_cents: number;
        total: number;
        issued: number;
        pending: number;
        revoked: number;
        revenue_cents: number;
      }>;
      revenue_by_month: Table<{
        month: string;
        item_type: string;
        transactions: number;
        total_cents: number;
      }>;
      school_impact: Table<{
        institution_id: string;
        name: string;
        region: string;
        province: string | null;
        workshops_done: number;
        students_reached: number;
        facilitators: number;
        last_workshop: string | null;
      }>;
      volunteer_leaderboard: Table<{
        user_id: string;
        full_name: string;
        region: string | null;
        type: VolunteerType;
        started_at: string;
        approved_hours: number;
        pending_hours: number;
        mentees: number;
      }>;
    };
    Functions: {
      /* ── Helpers de RBAC (0005) ── */
      has_role: { Args: { check_role: UserRole }; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
      my_institution_id: { Args: Record<string, never>; Returns: string | null };
      verify_certificate: {
        Args: { code: string };
        Returns: {
          holder_name: string;
          course_title: string;
          certificate: string;
          issuer: string;
          issued_at: string | null;
          is_valid: boolean;
        }[];
      };

      /* ── Lógica de negocio (0008) ── */
      enroll_in_course: { Args: { p_course_slug: string }; Returns: string };
      toggle_session_complete: {
        Args: { p_session_id: string; p_done?: boolean };
        Returns: number;
      };
      create_order: {
        Args: { p_item_type: string; p_item_id: string; p_ref_id?: string };
        Returns: string;
      };
      submit_payment_voucher: {
        Args: {
          p_order_id: string;
          p_method: PaymentMethodDb;
          p_voucher_url: string;
          p_operation_code: string;
        };
        Returns: string;
      };
      review_payment: {
        Args: { p_payment_id: string; p_approve: boolean; p_reason?: string };
        Returns: { approved: boolean; certificate_id?: string; plan?: string };
      };
      approve_volunteer_application: {
        Args: { p_application_id: string };
        Returns: string;
      };
      log_volunteer_hours: {
        Args: { p_date: string; p_hours: number; p_activity: string };
        Returns: string;
      };
      grant_role: { Args: { p_user_id: string; p_role: UserRole }; Returns: undefined };
      revoke_role: { Args: { p_user_id: string; p_role: UserRole }; Returns: undefined };
      review_school_application: {
        Args: { p_application_id: string; p_status: ApplicationStatusDb };
        Returns: undefined;
      };
      review_speaker_profile: {
        Args: { p_speaker_id: string; p_approve: boolean };
        Returns: undefined;
      };
      submit_diagnostic: {
        Args: {
          p_email: string;
          p_profile: SurveyProfileDb;
          p_region: string | null;
          p_answers: Json;
          p_utm?: string | null;
        };
        Returns: string;
      };

      /* ── Analítica (0009) ── */
      admin_dashboard: { Args: Record<string, never>; Returns: AdminDashboard };
      diagnostic_results: {
        Args: { p_profile: SurveyProfileDb };
        Returns: {
          question_number: number;
          question: string;
          tag: string | null;
          is_key: boolean;
          option_label: string;
          votes: number;
          pct: number;
        }[];
      };
      institution_impact_report: {
        Args: { p_institution_id: string };
        Returns: InstitutionImpactReport;
      };
    };
    Enums: {
      user_role: UserRole;
      volunteer_type: VolunteerType;
      institution_type: InstitutionType;
    };
    CompositeTypes: Record<string, never>;
  };
}
