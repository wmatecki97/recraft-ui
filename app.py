import gradio as gr
from openai import OpenAI
import json

# Replace with your actual API key
API_KEY = "YOUR_API_KEY"

client = OpenAI(
    base_url='https://external.api.recraft.ai/v1',
    api_key=API_KEY,
)

def generate_image(prompt, colors, style_id, style, substyle, model, response_format, artistic_level, size, num_images_per_prompt):
    
    try:
        colors_list = json.loads(colors) if colors else None
    except json.JSONDecodeError:
        return "Invalid JSON format for colors"

    extra_body = {}
    if style_id:
        extra_body['style_id'] = style_id
    
    controls = {}
    if colors_list:
        controls['colors'] = colors_list
    
    if controls:
         extra_body['controls'] = controls

    if num_images_per_prompt:
        n = int(num_images_per_prompt)
    else:
        n = 1

    response = client.images.generate(
        prompt=prompt,
        style=style,
        substyle=substyle,
        model=model,
        response_format=response_format,
        n=n,
        size=size,
        artistic_level=artistic_level,
        extra_body=extra_body
    )
    
    if response.
        image_urls = [item.url for item in response.data]
        return image_urls
    else:
        return "No image generated"


if __name__ == "__main__":
    with gr.Blocks() as demo:
        gr.Markdown("<h1>Recraft AI Image Generator</h1>")
        with gr.Row():
            with gr.Column():
                prompt_input = gr.Textbox(label="Prompt", value="Turtle working in AI")
                colors_input = gr.Textbox(label="Colors (JSON Array of RGB objects)", value='[{"rgb":[142,202,230]},{"rgb":[88,180,209]},{"rgb":[33,158,188]},{"rgb":[18,103,130]},{"rgb":[2,48,71]},{"rgb":[255,183,3]},{"rgb":[253,158,2]},{"rgb":[251,133,0]}]')
                style_id_input = gr.Textbox(label="Style ID", value="")
                style_input = gr.Dropdown(label="Style", choices=[None, "realistic_image", "digital_illustration", "photorealistic", "anime", "cartoon", "comic_book", "pixel_art", "3d_render", "abstract", "painting", "sketch"], value="digital_illustration")
                substyle_input = gr.Textbox(label="Substyle", value="")
                model_input = gr.Dropdown(label="Model", choices=["recraftv3", "recraft20b"], value="recraftv3")
                response_format_input = gr.Dropdown(label="Response Format", choices=["url", "b64_json"], value="url")
                artistic_level_input = gr.Slider(label="Artistic Level", minimum=0, maximum=5, step=1, value=0)
                size_input = gr.Dropdown(label="Size", choices=["1024x1024", "512x512", "1024x576", "576x1024"], value="1024x1024")
                num_images_input = gr.Number(label="Number of Images", value=1, minimum=1, maximum=2, step=1)
                generate_button = gr.Button("Generate Image")
            with gr.Column():
                image_output = gr.Gallery(label="Generated Images")

        generate_button.click(
            generate_image,
            inputs=[prompt_input, colors_input, style_id_input, style_input, substyle_input, model_input, response_format_input, artistic_level_input, size_input, num_images_input],
            outputs=image_output
        )

    demo.launch()
