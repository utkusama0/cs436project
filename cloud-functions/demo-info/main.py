import functions_framework
import requests

@functions_framework.http
def demo_info(request):
    # Example: fetch the homepage of your deployed frontend
    url = "http://34.29.190.192"  # Replace with your actual frontend URL if different
    try:
        resp = requests.get(url)
        return (resp.text, resp.status_code, {'Content-Type': resp.headers.get('Content-Type', 'text/html')})
    except Exception as e:
        return (f"Failed to fetch website: {str(e)}", 500)
