from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random 
from datetime import datetime

app = FastAPI(title="Data Visualization API")

# Enable CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # Url React
    allow_credentials=True,
    allow_method=["*"],
    allow_headers=["*"],
)

# Models 
class RevenueData(BaseModel):
    month: str
    value: int
    category: str

class CustomerData(BaseModel):
    month: str
    value: int

class CategoryDistribution(BaseModel):
    category: str
    value: int

class DashboardData(BaseModel):
    revenue: List[RevenueData]
    customers: List[CustomerData]
    categoryDistribution: List[CategoryDistribution]