from playwright.sync_api import sync_playwright


def active_name(page):
    return page.evaluate(
        "document.activeElement.getAttribute('aria-label') || "
        "document.activeElement.textContent.trim().slice(0, 48) || "
        "document.activeElement.tagName"
    )


with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844})

    for route, tabs in [("/login", 7), ("/registro", 7)]:
        page.goto(f"http://localhost:3010{route}")
        sequence = []
        for _ in range(tabs):
            page.keyboard.press("Tab")
            sequence.append(active_name(page))
        print(route, sequence)

    page.goto("http://localhost:3010/ai-design-thinking")
    menu = page.get_by_role("button", name="Abrir menú")
    menu.click()
    page.keyboard.press("Escape")
    print("drawer", menu.get_attribute("aria-expanded"), active_name(page))

    overflows = {}
    for width in [375, 390, 430, 640, 768, 834, 1024, 1280, 1440]:
        page.set_viewport_size({"width": width, "height": 900})
        page.goto("http://localhost:3010/ai-design-thinking")
        overflows[width] = page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth"
        )
    print("horizontal_overflow", overflows)

    page.emulate_media(reduced_motion="reduce")
    page.goto("http://localhost:3010/")
    reduced = page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
    duration = page.evaluate(
        """
        () => {
          const probe = document.createElement('div');
          probe.className = 'animate-fade-in';
          document.body.appendChild(probe);
          return getComputedStyle(probe).animationDuration;
        }
        """
    )
    print("reduced_motion", reduced, duration)

    page.goto("http://localhost:3010/")
    support = page.get_by_role("button", name="Apoya hoy")
    if support.count():
        support.click()
        page.wait_for_timeout(50)
        first = active_name(page)
        page.keyboard.press("Shift+Tab")
        last = active_name(page)
        page.keyboard.press("Tab")
        wrapped = active_name(page)
        page.keyboard.press("Escape")
        print(
            "dialog",
            {"first": first, "last": last, "wrapped": wrapped},
            "restored",
            support.evaluate("element => element === document.activeElement"),
        )
    else:
        # En CI sin acceso a Supabase, la portada debe mostrar el error
        # recuperable y no fingir que el catálogo está vacío.
        error_title = page.get_by_role("heading", name="No pudimos cargar esta página")
        print("data_error_fallback", error_title.is_visible())

    page.goto("http://localhost:3010/ruta-que-no-existe")
    print(
        "not_found",
        page.get_by_role("heading", name="Esta página no está aquí").is_visible(),
    )

    # Omite solo la validación nativa para comprobar el contrato de errores
    # devuelto por la acción y el foco programático del resumen reutilizable.
    page.goto("http://localhost:3010/donaciones")
    page.locator("form").evaluate("form => { form.noValidate = true }")
    page.get_by_role("button", name="Quiero donar").click()
    page.get_by_role("alert").first.wait_for()
    page.locator("#donorEmail:focus").wait_for()
    print("form_error_focus", page.evaluate("document.activeElement.id"))

    browser.close()
