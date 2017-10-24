from sanic import Sanic
from sanic.response import json
from sanic.response import text

app = Sanic()

@app.route('/', methods=['POST'])
async def post_handler(request):
    for h in request.json['history']:
        duration = h['endTime'] - h['startTime']
        print(duration, h['url'][:30])

    return text('POST request - {}'.format(""))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
