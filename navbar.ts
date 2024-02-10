
export default class Navbar
{
    // HTML elements properties
    parent: HTMLElement;
    base: HTMLElement;
    navbar: HTMLElement;

    // Navbar properties
    data: string;
    height: string;
    is_collapsible: boolean;
    is_collapsed: boolean;

    // Constructor
    constructor(parent: HTMLElement, base: HTMLElement)
    {
        this.parent = parent;
        this.base = base;
        this.navbar = parent.createDiv({cls: "navbar"});
        console.log("Navbar:", this.parent, this.base, this.navbar);
    }

    convert()
    {
        // Customize the data and height properties
        const info = this.base.getAttribute('data-callout-metadata');
		if (info !== null) {
			const info_array = info.split("|");
            this.data = info_array[0];
			this.navbar.setAttribute("navbar-data", this.data);
			this.height = info_array[1];
		}

        // Customize the collapsing properties
        const fold = this.base.getAttribute('data-callout-fold');
        this.is_collapsible = (fold === null) ? false : true;
        if (this.is_collapsible) {
            this.is_collapsed = (fold === "-") ? true : false;
        }

        // Customize the navbar header
        const navbar_sections = this.createNavHeader();

        // Customize the navbar content
        this.createNavContent(navbar_sections);

        // this.base.remove();
    }

    createNavHeader()
    {
        const navbar_header = this.navbar.createDiv({cls: "navbar-header"});

        // Customize the navbar header icon
        const navbar_icon = navbar_header.createDiv({cls: "navbar-icon"});        
        navbar_icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>';

        // Customize the navbar header title
        const navbar_title = navbar_header.createDiv({cls: "navbar-title"});
        const base_title = this.base.querySelector('.callout-title-inner');
        navbar_title.textContent = (base_title !== null) ? base_title.textContent : "";

        // TODO: Customize the navbar header fold

        // Customize the navbar header sections
        return navbar_header.createDiv({cls: "navbar-sections"});
    }

    createNavContent(navbar_sections:HTMLDivElement)
    {
        const navbar_content = this.navbar.createDiv({cls: "navbar-content"});

        // Customize each new navbar section
        const base_content = this.base.querySelector('.callout-content');
        if (base_content === null) {
            console.log("Base content is equal to null. Existing...");
            return;            
        }

        const base_sections = base_content.querySelectorAll(
            '.callout.is-collapsible.is-collapsed, .callout.is-collapsible, .callout'
        );

        for (let id = 1; id <= base_sections.length; id++)
        {
            const section = base_sections[id - 1];

            const header = navbar_sections.createDiv({
                cls:"navbar-section-header", attr:{"navbar-section-id": id}});
            const content = navbar_content.createDiv({
                cls:"navbar-section-content", attr:{"navbar-section-id": id}});

            this.createSection(section, header, content);
        }
    }
    
    createSection(section: Element, header: HTMLDivElement, body: HTMLDivElement)
    {
        console.log("ConvertToNavSection():", section, header, body);

        const section_data = section.getAttribute("data-callout");
        if (section_data !== null)
        {
            header.setAttribute("navbar-section-data", section_data);
            body.setAttribute("navbar-section-data", section_data);
        }
        else {} // TODO: implement using default values

        const base_fold = section.getAttribute("data-callout-fold");
        const fold = (base_fold === null || base_fold === "+") ? true : false;

        header.setAttribute("is-collapsed", fold.toString());
        body.setAttribute("is-collapsed", fold.toString());


        // Customize the new navbar section header
        const section_header = section.querySelector('.callout-title');
        if (section_header === null) {
            console.log("Section header is null. Returning...");
            return;            
        }

        const icon = header.createDiv({cls: "navbar-section-icon"});
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>';

        const title = header.createDiv({cls: "navbar-section-title"});
        const base_title = section_header.querySelector('.jcallout-title-inner');
        title.textContent = (base_title !== null) ? base_title.textContent : "";


        // Customize the nex navbar section body
        const section_body = section.querySelector('.callout-content');
        





    }
}
