import gradio as gr
import openai
import json

def generate_image(api_key, prompt, colors, style_id, style, substyle, model, response_format, artistic_level, size, num_images_per_prompt):
    try:
        client = openai.OpenAI(api_key=api_key)
        
        colors_list = json.loads(colors) if colors else None

        params = {
            "prompt": prompt,
            "colors": colors_list,
            "style_id": style_id,
            "style": style,
            "substyle": substyle,
            "model": model,
            "response_format": response_format,
            "artistic_level": artistic_level,
            "size": size,
            "num_images_per_prompt": num_images_per_prompt
        }
        
        response = client.images.generate(**params)

        if response:
            image_urls = [item.url for item in response.data]
            return image_urls
        else:
            return ["No images generated"]
    except Exception as e:
        return [f"Error: {e}"]

if __name__ == "__main__":
    with gr.Blocks() as demo:
        api_key = gr.Textbox(label="Recraft API Key", type="password")
        prompt = gr.Textbox(label="Prompt")
        colors = gr.Textbox(label="Colors (JSON string, e.g., ['red', 'blue'])", placeholder="['red', 'blue']")
        style_id = gr.Textbox(label="Style ID", placeholder="e.g., 1234")
        style = gr.Dropdown(label="Style", choices=["", "photorealistic", "anime", "3d", "abstract", "cartoon", "comic", "cyberpunk", "fantasy", "graffiti", "impressionism", "lineart", "lowpoly", "minimalism", "mosaic", "origami", "pixelart", "popart", "renaissance", "sketch", "steampunk", "surrealism", "vectorart"])
        substyle = gr.Textbox(label="Substyle", placeholder="e.g., 'detailed'")
        model = gr.Dropdown(label="Model", choices=["", "recraft/realistic", "recraft/creative", "recraft/artistic"])
        response_format = gr.Dropdown(label="Response Format", choices=["", "url", "b64_json"])
        artistic_level = gr.Slider(label="Artistic Level", minimum=0, maximum=10, step=1, value=5)
        size = gr.Dropdown(label="Size", choices=["", "256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"])
        num_images_per_prompt = gr.Number(label="Number of Images", value=1, minimum=1, maximum=4)
        
        
        generate_button = gr.Button("Generate Image")
        gallery = gr.Gallery(label="Generated Images")

        generate_button.click(
            generate_image,
            inputs=[api_key, prompt, colors, style_id, style, substyle, model, response_format, artistic_level, size, num_images_per_prompt],
            outputs=gallery
        )

    demo.launch()
