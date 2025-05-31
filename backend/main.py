from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
from typing import List, Dict, Any, Set

app = FastAPI()


origins = [
    "http://localhost:3000", ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], #
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str

class Edge(BaseModel):
    source: str  # ID of the source node
    target: str  # ID of the target node
class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag_util(
    node_id: str,
    adj: Dict[str, List[str]],
    visited: Set[str],
    recursion_stack: Set[str]
) -> bool:
    visited.add(node_id)
    recursion_stack.add(node_id)

    for neighbor in adj.get(node_id, []):
        if neighbor not in visited:
            if is_dag_util(neighbor, adj, visited, recursion_stack):
                return True 
        elif neighbor in recursion_stack:
            return True 

    recursion_stack.remove(node_id)
    return False #

def check_is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    adj: Dict[str, List[str]] = {node.id: [] for node in nodes}
    node_ids: Set[str] = {node.id for node in nodes}

    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
        else:
            pass


    visited: Set[str] = set()
    recursion_stack: Set[str] = set()

    for node in nodes:
        if node.id not in visited:
            if is_dag_util(node.id, adj, visited, recursion_stack):
                return False  
    return True  


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse') 
async def parse_pipeline(payload: PipelinePayload): 
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)

    is_pipeline_dag = check_is_dag(payload.nodes, payload.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_pipeline_dag
    }

