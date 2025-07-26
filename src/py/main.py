import sys
import os
from run import DummyMath
from typing import Any, List, Union

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: Union[str, List[float]]  # Accepts either a string or a list of floats


@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/update-message")
def update_message(msg: Message):
    # Here you can process the message as needed
    return {"message": f"Received: {msg.message}"}

@app.post("/api/run-optimizer")
def run_optimizer(msg: dict):
    # Process the message as needed
    print(msg)
    dummy = DummyMath(1, 2)
    result = dummy.calculate()
    print(result)
    return {"message": f"Output: {result}"}

if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8001)
