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

# Sample data generator 
def generate_sample_data():
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    revenue_data = []
    for month in months:
        revenue_data.append({
            "month": month,
            "value": random.randint(100000000, 300000000),
            "category": "Produk A"
        })
    
    customer_data = []
    base = 1000
    for month in months:
        base += random.randint(50, 200)
        customer_data.append({
            "month": month,
            "value": base
        })
    
    category_data = [
        {"category": "Produk A", "value": 450000000},
        {"category": "Produk B", "value": 380000000},
        {"category": "Produk C", "value": 290000000},
        {"category": "Produk D", "value": 210000000},
        {"category": "Produk E", "value": 170000000}
    ]

    return {
        "revenue": revenue_data,
        "customers": customer_data,
        "categoryDistribution": category_data
    }

# Routes 
@app.get("/")
def read_root():
    return {
        "message": "Data Visualization API",
        "version": "1.0.0",
        "endpoints": {
            "dashboard": "/api/dashboard",
            "docs": "/docs"
        }
    }

@app.get("/api/dashboard", response_model=DashboardData)
def get_dashboard_data():
    """
    Get complete dashboard data including revenue, customers, and category distribution
    """
    return generate_sample_data()

@app.get("/api/revenue")
def get_revenue(year: int = 2025):
    """
    Get revenue data by year
    """
    data = generate_sample_data()
    return {"year": year, "data": data["revenue"]}

@app.get("/api/customers")
def get_customers(year: int = 2025):
    """
    Get customer data by year
    """
    data = generate_sample_data()
    return {"year": year, "data": data["customers"]}

@app.get("/api/categories")
def get_categories():
    """
    Get category distribution data
    """
    data = generate_sample_data()
    return data["categoryDistribution"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)