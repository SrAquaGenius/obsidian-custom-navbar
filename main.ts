import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class CustomNavbar extends Plugin
{
	settings: MyPluginSettings;

	async onload()
	{
		await this.loadSettings();
		await this.saveSettings();

		this.registerEvent(this.app.workspace.on("file-open", () => {
			this.searchInOpenFile();
		}));
	}

	onunload() {}

	async loadSettings()
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings()
	{
		await this.saveData(this.settings);
	}

	async searchInOpenFile()
	{
		const { workspace } = this.app;

		const leaf_html = (workspace.getLeaf()).containerEl;
		const callouts = leaf_html.querySelectorAll('.callout[data-callout="navbar"]');

		if (callouts.length === 0)
			console.log("No callouts found!", callouts);

		else
		{
			console.log("Found navbar callouts!", callouts);
			for (let c = 0; c < callouts.length; c++)
				this.convertToNavBar(callouts[c]);
		}
	}

	convertToNavBar(navbar: any)
	{
		console.log(navbar);

		// Customize the new navbar
		navbar.classList.add('navbar');
		navbar.classList.remove('callout');
		const navbar_data = navbar.getAttribute('data-callout-metadata');
		if (navbar_data !== null) navbar.setAttribute('navbar-data', navbar_data);
		navbar.removeAttribute('data-callout-metadata');
		navbar.removeAttribute('data-callout-fold');
		navbar.removeAttribute('data-callout');

		// Customize the new navbar header
		const navbar_sections = this.convertToNavHeader(navbar);

		// Customize the new navbar content
		this.convertToNavContent(navbar, navbar_sections);

		console.log("ConvertToNavBar()->#end", navbar);
	}

	convertToNavHeader(navbar: any)
	{
		const navbar_header = this.changeClass(
			navbar, 'callout-title', 'navbar-header'
		);
		this.changeClass(navbar_header, 'callout-icon', 'navbar-icon');
		this.changeClass(navbar_header, 'callout-title-inner', 'navbar-title');

		let navbar_sections = navbar_header.querySelector('.navbar-sections');
		if (navbar_sections === null)
		{
			navbar_sections = document.createElement('div');
			navbar_sections.classList.add('navbar-sections');
			navbar_header.appendChild(navbar_sections);
		}

		return navbar_sections;
	}

	convertToNavContent(navbar: any, navbar_sections: any)
	{
		const navbar_content = this.changeClass(
			navbar, 'callout-content', 'navbar-content'
		);

		// Customize each new navbar section
		const sections = navbar_content.querySelectorAll('.callout.is-collapsible.is-collapsed, .callout.is-collapsible, .callout');

		for (let s = 0; s < sections.length; s++)
		{
			let section = sections[s];
			this.convertToNavSection(section, (s + 1));

			// Re-organize the header and the contents
			let header = section.querySelector('.navbar-section-header');
			let content = section.querySelector('.navbar-section-content');

			navbar_sections.appendChild(header);
			navbar_content.appendChild(content);

			navbar_content.removeChild(section);
		}
	}

	convertToNavSection(section: any, id: number)
	{
		console.log("ConvertToNavSection():", section, id);

		// Customize the new navbar section
		section.classList.add('navbar-section');
		section.classList.remove('callout');
		section.classList.remove('is-collapsible');
		section.classList.remove('is-collapsed');

		const section_data = section.getAttribute('data-callout');
		section.setAttribute('navbar-section-data', section_data);

		const fold = (section.getAttribute('data-callout-fold') === '+') ? 'false' : 'true';
		section.setAttribute('is-collapsed', fold);

		section.removeAttribute('data-callout-metadata');
		section.removeAttribute('data-callout-fold');
		section.removeAttribute('data-callout');

		// Customize the new navbar section header
		const section_header = this.changeClass(
			section, 'callout-title', 'navbar-section-header'
		);
		section_header.setAttribute('navbar-id', id);
		section_header.setAttribute('navbar-section-data', section_data);
		section_header.setAttribute('is-collapsed', fold);

		this.changeClass(section_header, 'callout-icon', 'navbar-section-icon');
		this.changeClass(section_header, 'callout-title-inner', 'navbar-section-title');

		const section_fold = this.changeClass(
			section_header, 'callout-fold', 'navbar-section-fold'
		);
		section_fold.classList.remove('is-collapsed');
		section_fold.setAttribute('is-collapsed', fold);

		// Customize the new navbar section content
		const section_content = this.changeClass(
			section, 'callout-content', 'navbar-section-content'
		);
		section_content.setAttribute('navbar-id', id);
		section_content.setAttribute('navbar-section-data', section_data);
		section_content.setAttribute('is-collapsed', fold);
	}

	/* --------------------------------------------------------------------- */
	changeClass(parent: any, oldClass: any, newClass: any)
	{
		const element = parent.querySelector('.' + oldClass);
		if (element !== null)
		{
			element.classList.add(newClass);
			element.classList.remove(oldClass);
			return element;
		}

		else return parent.querySelector('.' + newClass);
	}

	/* --------------------------------------------------------------------- */
	toggleSection(navbar, header, content)
	{
		console.log("Togfgling");		
	}
}

/*

// const { vault } = this.app;
		// const files: TFile[] = vault.getMarkdownFiles();
		// const navbar_files: TFile[] = [];
		// const str = "!navbar";

		// for (const file of files) {
		// 	const content = await vault.cachedRead(file);
	
		// 	if (content.includes(str)) {
		// 		navbar_files.push(file); // Add the file to navbar_files array
		// 		// console.log(content);
		// 	}
		// }
			
		// console.log("Files:", navbar_files.length);
		// navbar_files.forEach(nav => {console.log(nav.path);});



// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				// new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
*/

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
