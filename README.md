# Showcase Template

Welcome to the [gohugo](https://gohugo.io/) template to create rich content [academic reports](https://www.wordy.com/writers-workshop/writing-an-academic-report/) having [p5.js](https://p5js.org/) sketches.

## Docker

This project is dockerized, so you can run it with:

```sh
docker run -p 1313:1313 hugo-visual-computing
```

## Hacking

Install the [gohugo](https://gohugo.io/) [static site generator](https://jamstack.org/generators/) then:

```sh
$git clone https://github.com/VisualComputing/visual-computing-assignments
$cd visual-computing-assignments
$git submodule update --init --recursive
$hugo server -D --disableFastRender
```

Deploy with `$git push` after redefined `baseURL` in `config.toml` which should point to your actual public remote.

**Don't rename the repo but leave it as 'visual-computing-assignments'**  
even so if you decided to rename the repo anyways, say to `newreponame`, don't forget to update all url references of the markdown and js file sources, to reflect that change, i.e., look within all [content folder](https://github.com/VisualComputing/visual-computing-assignments/tree/main/content) files for `visual-computing-assignments` occurrences and replace them by `newreponame`, which should be easily doable in any recent open source code editor, e.g., 🔎 in [kate](https://kate-editor.org/) or [vs-codium](https://vscodium.com/).

### Remarks

1. If you forked the repo don't forget to activate the [actions](https://github.com/VisualComputing/visual-computing-assignments/actions).
2. Don't forget to select the `gh-pages` branch as the one to serve your site from at the [pages section of your repo configuration page](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), if it is no so by default.
3. The **visual-computing-assignments** template uses the [hugo-book](https://github.com/alex-shpak/hugo-book) theme by default. Check the [hugo themes site](https://themes.gohugo.io/) if you wish to add other ones.
