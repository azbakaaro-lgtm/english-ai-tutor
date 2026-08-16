import { useRef, useEffect, useCallback } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link2, Heading2, Pilcrow, Table2, Image } from "lucide-react";

// A minimal, dependency-free WYSIWYG editor built on the browser's native
// contentEditable + execCommand. This lets an admin format lesson/reading
// content (headings, bold, italic, lists, tables, images, links) without
// knowing any HTML — no external rich-text library, so no extra cost or
// bundle weight.
export default function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (ref.current && !isInternalChange.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    isInternalChange.current = true;
    onChange(ref.current.innerHTML);
  }, [onChange]);

  function exec(command, arg = null) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  }

  function insertLink() {
    const url = window.prompt("Link URL (https://…):");
    if (url) exec("createLink", url);
  }

  function insertImage() {
    const url = window.prompt("Image URL (https://…):");
    if (!url) return;
    exec("insertHTML", `<img src="${escapeAttr(url)}" alt="" style="max-width:100%;border-radius:0.75rem;margin:0.5rem 0;" />`);
  }

  function insertTable() {
    const rowsInput = window.prompt("How many rows?", "3");
    const colsInput = window.prompt("How many columns?", "2");
    const rows = Math.max(1, Math.min(10, parseInt(rowsInput, 10) || 3));
    const cols = Math.max(1, Math.min(6, parseInt(colsInput, 10) || 2));
    let html = '<table><tbody>';
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) html += "<td>&nbsp;</td>";
      html += "</tr>";
    }
    html += "</tbody></table><p><br/></p>";
    exec("insertHTML", html);
  }

  const buttons = [
    { icon: Bold, cmd: () => exec("bold"), label: "Bold" },
    { icon: Italic, cmd: () => exec("italic"), label: "Italic" },
    { icon: Underline, cmd: () => exec("underline"), label: "Underline" },
    { icon: Heading2, cmd: () => exec("formatBlock", "H3"), label: "Heading" },
    { icon: Pilcrow, cmd: () => exec("formatBlock", "P"), label: "Paragraph" },
    { icon: List, cmd: () => exec("insertUnorderedList"), label: "Bullet list" },
    { icon: ListOrdered, cmd: () => exec("insertOrderedList"), label: "Numbered list" },
    { icon: Table2, cmd: insertTable, label: "Table" },
    { icon: Image, cmd: insertImage, label: "Image" },
    { icon: Link2, cmd: insertLink, label: "Link" },
  ];

  return (
    <div className="rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-900 overflow-hidden">
      <div className="flex items-center gap-0.5 border-b border-ink-100 dark:border-ink-700 px-1.5 py-1 flex-wrap">
        {buttons.map(({ icon: Icon, cmd, label }) => (
          <button
            key={label}
            type="button"
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={cmd}
            className="p-1.5 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-800 dark:hover:text-white transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={(e) => {
          // Clean-paste: strip pasted formatting/markup down to plain text
          // so pasted content matches the editor's own styling instead of
          // dragging in random external CSS/inline styles.
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
          handleInput();
        }}
        data-placeholder={placeholder}
        className="richtext-editable px-3.5 py-2.5 text-sm min-h-[6rem] max-h-72 overflow-y-auto outline-none text-ink-800 dark:text-ink-100 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-azure-500 [&_a]:underline [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-1 [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:border-ink-200 dark:[&_td]:border-ink-600 [&_td]:px-2 [&_td]:py-1 [&_img]:rounded-lg"
      />
    </div>
  );
}

function escapeAttr(s) {
  return s.replace(/"/g, "&quot;");
}
