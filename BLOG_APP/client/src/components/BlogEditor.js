import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";

const BlogEditor = ({
  initialContent = "",
  onChange,
  placeholder = "Write your blog post...",
}) => {
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    setContent(content);
    onChange(content);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Editor
        apiKey="your-tinymce-api-key"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar: [
            "undo redo | blocks | bold italic underline strikethrough",
            "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
            "link image media table | forecolor backcolor | removeformat code help",
          ],
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 16px;
              line-height: 1.6;
              padding: 10px;
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          statusbar: true,
          elementpath: false,
          resize: "vertical",
          image_uploadtab: true,
        }}
        onEditorChange={handleEditorChange}
      />
      <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
        Character count: {content.replace(/<[^>]*>/g, "").length}
      </div>
    </div>
  );
};

export default BlogEditor;
