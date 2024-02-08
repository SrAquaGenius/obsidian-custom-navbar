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

		this.registerEvent(this.app.workspace.on("file-open",
			() => { this.searchInOpenFile(); }));
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


		const { workspace } = this.app;

		const leaf_html = (workspace.getLeaf()).containerEl;
		// console.log(leaf_html);

		const callouts = leaf_html.querySelectorAll('.callout[data-callout="navbar"]');
		if (callouts === null) {
			console.log("No callouts found!");
		}
		else {
			console.log("Found navbar callouts|");
			
		}

		// callouts.forEach((callout: any) => { this.convertToNavBar(callout); });
	}

	convertToNavBar(nav: any)
	{
		console.log(nav);

		// Customize the new navbar
		nav.classList.add('navbar');
		nav.classList.remove('callout');
		const nav_data = nav.getAttribute('data-callout-metadata');
		if (nav_data !== null) nav.setAttribute('navbar-data', nav_data);
		nav.removeAttribute('data-callout-metadata');
		nav.removeAttribute('data-callout-fold');
		nav.removeAttribute('data-callout');

		// Customize the new navbar header
		const nav_header = this.ChangeClass(
			nav, 'callout-title', 'navbar-header'
		);
		this.ChangeClass(nav_header, 'callout-icon', 'navbar-icon');
		this.ChangeClass(nav_header, 'callout-title-inner', 'navbar-title');

		let nav_sections = nav_header.querySelector('.navbar-sections');
		if (nav_sections === null)
		{
			nav_sections = document.createElement('div');
			nav_sections.classList.add('navbar-sections');
			nav_header.appendChild(nav_sections);
		}

		// Customize the new navbar content
		const nav_content = this.ChangeClass(
			nav, 'callout-content', 'navbar-content'
		);

		// Customize each new navbar section
		const sections = nav_content.querySelectorAll('.callout.is-collapsible.is-collapsed, .callout.is-collapsible, .callout');
		let id = 1;
		for (let section of sections)
		{
			this.ConvertToNavSection(section, id);

			// Re-organize the header and the contents
			let header = section.querySelector('.navbar-section-header');
			let content = section.querySelector('.navbar-section-content');

			nav_sections.appendChild(header);
			nav_content.appendChild(content);

			nav_content.removeChild(section);

			id++;
		}

		console.log("ConvertToNavBar()->#end", nav);
	}

	ConvertToNavSection(section: any, id: any)
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
		const section_header = this.ChangeClass(
			section, 'callout-title', 'navbar-section-header'
		);
		section_header.setAttribute('navbar-id', id);
		section_header.setAttribute('navbar-section-data', section_data);
		section_header.setAttribute('is-collapsed', fold);

		this.ChangeClass(section_header, 'callout-icon', 'navbar-section-icon');
		this.ChangeClass(section_header, 'callout-title-inner', 'navbar-section-title');

		const section_fold = this.ChangeClass(
			section_header, 'callout-fold', 'navbar-section-fold'
		);
		section_fold.classList.remove('is-collapsed');
		section_fold.setAttribute('is-collapsed', fold);

		// Customize the new navbar section content
		const section_content = this.ChangeClass(
			section, 'callout-content', 'navbar-section-content'
		);
		section_content.setAttribute('navbar-id', id);
		section_content.setAttribute('navbar-section-data', section_data);
		section_content.setAttribute('is-collapsed', fold);
	}

	/* --------------------------------------------------------------------- */
	ChangeClass(parent: any, oldClass: any, newClass: any)
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
}

/*
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
