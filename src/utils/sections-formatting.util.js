const escapeHTML = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const convertToPlainText = (sections) => {
  return sections
    .map((section) => {
      switch (section.type) {
        case "heading":
          return `${"#".repeat(section.level)} ${section.text}\n\n`;
        case "paragraph":
          return `${section.text}\n\n`;
        case "blockquote":
          return `> ${section.text}\n\n`;
        case "list":
          const listItems = section.items
            .map((item, index) =>
              section.ordered ? `${index + 1}. ${item}` : `- ${item}`
            )
            .join("\n");
          return `${listItems}\n\n`;
        case "code":
          return `\`\`\`${section.language}\n${section.code}\n\`\`\`\n\n`;
        case "table":
          const headers = section.headers.join(" | ");
          const separator = section.headers.map(() => "---").join(" | ");
          const rows = section.rows.map((row) => row.join(" | ")).join("\n");
          return `${headers}\n${separator}\n${rows}\n\n`;
        default:
          return "";
      }
    })
    .join("");
};

export const convertToHTML = (sections) => {
  return sections
    .map((section) => {
      switch (section.type) {
        case "heading":
          return `<h${section.level}>${section.text}</h${section.level}>`;
        case "paragraph":
          return `<p>${section.text}</p>`;
        case "blockquote":
          return `<blockquote>${section.text}</blockquote>`;
        case "list":
          const tag = section.ordered ? "ol" : "ul";
          const items = section.items
            .map((item) => `<li>${item}</li>`)
            .join("");
          return `<${tag}>${items}</${tag}>`;
        case "code":
          return `<pre><code class="language-${section.language}">${escapeHTML(
            section.code
          )}</code></pre>`;
        case "table":
          const headerRow = section.headers
            .map((h) => `<th>${h}</th>`)
            .join("");
          const rows = section.rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
            )
            .join("");
          return `<table><thead><tr>${headerRow}</tr></thead><tbody>${rows}</tbody></table>`;
        default:
          return "";
      }
    })
    .join("");
};
