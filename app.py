import gradio as gr
import openai
import json

def generate_image(api_key, prompt, colors, style, response_format, artistic_level, size, num_images_per_prompt):
    try:
        client = openai.OpenAI(base_url='https://external.api.recraft.ai/v1',
                               api_key=api_key)
        
        colors_list = json.loads(colors) if colors else None

        params = {
            "prompt": prompt,
            "extra_body": {

            "style": "vector_illustration",
            "substyle":"roundish_flat",
            "model": "recraftv3",
            "response_format": response_format,
            "artistic_level": artistic_level,
            "size": size,
            "num_images_per_prompt": num_images_per_prompt,
                "controls": {
                    "colors": colors_list
                }
            }
        }
        
        response = client.images.generate(**params)

        if response:
            image_urls = [item.url for item in response.data]
            return image_urls
        else:
            return ["No images generated"]
    except Exception as e:
        print(e)
        return [f"Error: {e}"]

if __name__ == "__main__":
    with gr.Blocks() as demo:
        api_key = gr.Textbox(label="Recraft API Key", type="password")
        prompt = gr.Textbox(label="Prompt", value="Turtle working in AI")
        colors_data = [{"rgb":[142,202,230]},{"rgb":[88,180,209]},{"rgb":[33,158,188]},{"rgb":[18,103,130]},{"rgb":[2,48,71]},{"rgb":[255,183,3]},{"rgb":[253,158,2]},{"rgb":[251,133,0]}]
        colors = gr.Textbox(label="Colors (JSON string, e.g., ['red', 'blue'])", placeholder="['red', 'blue']", value=json.dumps(colors_data))

        response_format = gr.Dropdown(label="Response Format", choices=["", "url", "b64_json"], value="url")
        artistic_level = gr.Slider(label="Artistic Level", minimum=0, maximum=10, step=1, value=5)
        size = gr.Dropdown(label="Size", choices=["", "256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"], value="1024x1024")
        num_images_per_prompt = gr.Number(label="Number of Images", value=2, minimum=1, maximum=4)
        
        
        generate_button = gr.Button("Generate Image")
        gallery = gr.Gallery(label="Generated Images")

        generate_button.click(
            generate_image,
            inputs=[api_key, prompt, colors, response_format, artistic_level, size, num_images_per_prompt],
            outputs=gallery
        )

    demo.launch()
