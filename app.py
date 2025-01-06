import gradio as gr
import requests
import json
import os
import uuid

def generate_image(api_key, prompt, colors, response_format, artistic_level, size, num_images_per_prompt):
    try:
        url = 'https://external.api.recraft.ai/v1/images/generations'
        headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        
        colors_list = json.loads(colors) if colors else None

        data = {
            "prompt": prompt,
            "model": "recraftv3",
            "n": num_images_per_prompt,
            "style": "vector_illustration",
            "substyle":"roundish_flat",
            "controls": {
                "colors": colors_list,
                "artistic_level": artistic_level
            }
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        response_data = response.json()

        if response_data and response_data.get('data'):
            image_files = []
            for item in response_data['data']:
                image_url = item.get('url')
                if image_url:
                    try:
                        image_response = requests.get(image_url, stream=True)
                        image_response.raise_for_status()
                        
                        file_name = f"image_{uuid.uuid4()}.png"
                        file_path = os.path.join(os.getcwd(), file_name)
                        
                        with open(file_path, 'wb') as f:
                            for chunk in image_response.iter_content(chunk_size=8192):
                                f.write(chunk)
                        image_files.append(gr.File(file_path))
                    except requests.exceptions.RequestException as e:
                        print(f"Error downloading image: {e}")
                else:
                    print("No image URL found in response item")
            if image_files:
                return image_files
            else:
                return [gr.File(None, label="No images generated")]
        else:
            return [gr.File(None, label="No images generated")]
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return [gr.File(None, label=f"Request Error: {e}")]
    except Exception as e:
        print(f"Error: {e}")
        return [gr.File(None, label=f"Error: {e}")]

if __name__ == "__main__":
    with gr.Blocks() as demo:
        api_key = gr.Textbox(label="Recraft API Key", type="password")
        prompt = gr.Textbox(label="Prompt", value="Turtle working in AI")
        colors_data = [{"rgb":[142,202,230]},{"rgb":[88,180,209]},{"rgb":[33,158,188]},{"rgb":[18,103,130]},{"rgb":[2,48,71]},{"rgb":[255,183,3]},{"rgb":[253,158,2]},{"rgb":[251,133,0]}]
        colors = gr.Textbox(label="Colors (JSON string, e.g., [{'rgb':[255,0,0]}, {'rgb':[0,0,255]}])", placeholder="[{'rgb':[255,0,0]}, {'rgb':[0,0,255]}]", value=json.dumps(colors_data))

        response_format = gr.Dropdown(label="Response Format", choices=["", "url", "b64_json"], value="url")
        artistic_level = gr.Slider(label="Artistic Level", minimum=0, maximum=10, step=1, value=5)
        size = gr.Dropdown(label="Size", choices=["", "256x256", "512x512", "1024x1024", "1024x1792", "1792x1024"], value="1024x1024")
        num_images_per_prompt = gr.Number(label="Number of Images", value=1, minimum=1, maximum=4)
        
        
        generate_button = gr.Button("Generate Image")
        file_output = gr.File(label="Generated Images")

        generate_button.click(
            generate_image,
            inputs=[api_key, prompt, colors, response_format, artistic_level, size, num_images_per_prompt],
            outputs=file_output
        )

    demo.launch()
