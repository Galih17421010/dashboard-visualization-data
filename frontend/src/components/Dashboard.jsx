import React, { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import { BarChart3, DollarSign, Download, Filter, TrendingUp, Users } from "lucide-react";

const DataVisualizationDahsboard = () => {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedChart, setSelectedChart] = useState('revenue');

    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartRef = useRef(null);

    const rawData = {
        revenue: [
            { month: 'Jan', value: 125000000, category: 'Produk A' },
            { month: 'Feb', value: 145000000, category: 'Produk A' },
            { month: 'Mar', value: 165000000, category: 'Produk A' },
            { month: 'Apr', value: 155000000, category: 'Produk A' },
            { month: 'May', value: 185000000, category: 'Produk A' },
            { month: 'Jun', value: 195000000, category: 'Produk A' },
            { month: 'Jul', value: 205000000, category: 'Produk A' },
            { month: 'Aug', value: 215000000, category: 'Produk A' },
            { month: 'Sep', value: 225000000, category: 'Produk A' },
            { month: 'Oct', value: 235000000, category: 'Produk A' },
            { month: 'Nov', value: 245000000, category: 'Produk A' },
            { month: 'Dec', value: 265000000, category: 'Produk A' }, 
        ],
        customers: [
            { month: 'Jan', value: 1250 },
            { month: 'Feb', value: 1450 },
            { month: 'Mar', value: 1650 },
            { month: 'Apr', value: 1550 },
            { month: 'May', value: 1850 },
            { month: 'Jun', value: 1950 },
            { month: 'Jul', value: 2050 },
            { month: 'Aug', value: 2150 },
            { month: 'Sep', value: 2250 },
            { month: 'Oct', value: 2350 },
            { month: 'Nov', value: 2450 },
            { month: 'Dec', value: 2650 },
        ],
        categoryDistribution: [
            { category: 'Produk A', value: 450000000 },
            { category: 'Produk B', value: 380000000 },
            { category: 'Produk C', value: 290000000 },
            { category: 'Produk D', value: 210000000 },
            { category: 'Produk E', value: 170000000 },
        ]
    };

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        }).format(value);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    const totalRevenue = rawData.revenue.reduce((sum, item) => sum + item.value, 0);
    const totalCustomers = rawData.customers[rawData.customers.length - 1].value;
    const avgRevenue = totalRevenue / rawData.revenue.length;
    const growthRate = ((rawData.revenue[11].value - rawData.revenue[0].value) / rawData.revenue[0].value * 100).toFixed(1);

    useEffect(() => {
        if (!barChartRef.current) return ;

        const margin = { top:20, right:30, bottom:40, left: 80 };
        const width = barChartRef.current.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(barChartRef.current).selectAll('*').remove();

        const svg = d3.select(barChartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const data = rawData.revenue;

        const x = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([0, width])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);
        
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', '#64748b')
            .style('font-size', '12px');
        
        svg.append('g')
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d => formatRupiah(d)))
            .selectAll('text')
            .style('fill', '#64748b')
            .style('font-size', '11px');

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('react')
            .attr('class', 'bar')
            .attr('x', d => x(d.month))
            .attr('y', height)
            .attr('width', x.bandwidth())
            .attr('height', 0)
            .attr('fill', '#3b82f6')
            .attr('rx', 4)      
            .transition()
            .duration(800)
            .attr('y', d => y(d.value))          
            .attr('height', d => height - y(d.value));

        svg.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d.month) + x.bandwidth() / 2)
            .attr('y', d => y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .style('fill', '#475569')
            .style('font-size', '10px')
            .style('opacity', 0)
            .text(d => formatRupiah(d.value).replace('Rp', ''))
            .transition()
            .duration(800)
            .style('opacity', 1);
    }, [selectedYear, selectedCategory]);

    useEffect(() => {
        if (!lineChartRef.current) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const width = lineChartRef.current.clientWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        d3.select(lineChartRef.current).selectAll('*').remove();

        const svg = d3.select(d3.lineChartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const data = rawData.customers;

        const x = d3.scalePoint()
            .domain(data.map(d => d.month))
            .range([0, width])
            .padding(0.5);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);
        
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', '#64748b')
            .style('font-size', '12px');

        svg.append('g')
            .call(d3.axisLeft(y).ticks(5))
            .selectAll('text')
            .style('fill', '#64748b')
            .style('font-size', '12px');
        
        const line = d3.line()
            .x(d => x(d.month))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        const path = svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10b981')
            .attr('stroke-width', 3)
            .attr('d', line);
        
        const totalLength = path.node().getTotalLength();

        path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);
        
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.month))
            .attr('cy', d => y(d.value))
            .attr('r', 0)
            .attr('fill', '#10b981')
            .transition()
            .delay(1000)
            .duration(500)
            .attr('r', 5);
    }, [selectedYear]);

    useEffect(() => {
        if (!pieChartRef.current) return;

        const width = pieChartRef.current.clientWidth;
        const height = 300;
        const radius = Math.min(width, height) / 2 - 40;

        d3.select(pieChartRef.current).selectAll('*').remove();

        const svg = d3.select(pieChartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        const data = rawData.categoryDistribution;

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.category))
            .range(['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']);
        
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius);
        
        const arcHover = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 1.1);

        const arcs = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.category))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('opacity', 0.9)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arcHover)
                    .style('opacity', 1);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arc)
                    .style('opacity', 0.9)
            })
            .transition()
            .duration(1000)
            .attrTween('d', function(d){
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });
        
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('opacity', 0)
            .text(d => d.data.category)
            .transition()
            .delay(1000)
            .duration(500)
            .style('opacity', 1);
    }, []);

    const exportData = () => {
        const dataStr = JSON.stringify(rawData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dashboard-data.json';
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-scale-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Data Visualization Dashboard</h1>
                    <p className="text-slate-600">Analisis data bisnis real-time dengan visualisasi interaktif</p>
                </div>
                
                {/* Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-600" />
                            <span className="font-semibold text-slate-700">Filter :</span>
                        </div>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="produk-a">Produk A</option>
                            <option value="produk-b">Produk B</option>
                            <option value="produk-c">Produk C</option>
                            <option value="produk-d">Produk D</option>
                            <option value="produk-e">Produk E</option>
                        </select>

                        <button 
                            onClick={exportData}
                            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export Data 
                        </button>
                    </div>
                </div>

                {/* Metrics Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600 text-sm font-medium">Total Pendapatan</span>
                            <DollarSign className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{formatRupiah(totalRevenue)}</div>
                        <div className="text-green-600 text-sm font-medium">+{growthRate}% dari bulan sebelumnya</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600 text-sm font-medium">Total Pelanggan</span>
                            <Users className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{formatNumber(totalCustomers)}</div>
                        <div className="text-green-600 text-sm font-medium">+12.5% dari bulan sebelumnya</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600 text-sm font-medium">Rata-rata Pendapatan</span>
                            <TrendingUp className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{formatRupiah(avgRevenue)}</div>
                        <div className="text-green-600 text-sm font-medium">+8.2% dari bulan sebelumnya</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-600 text-sm font-medium">Tingkat Pertumbuhan</span>
                            <BarChart3 className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{growthRate}%</div>
                        <div className="text-green-600 text-sm font-medium">Target tercapai 95%</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Bar Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                            Pendapatan Bulanan {selectedYear}
                        </h2>
                        <div ref={barChartRef} className="w-full"></div>
                    </div>

                    {/* Line Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-600"/>
                            Pertumbuhan Pelanggan {selectedYear}
                        </h2>
                        <div ref={lineChartRef} className="w-full"></div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Distribusi Pendapatan per Kategori</h2>
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div ref={pieChartRef} className="flex-1 w-full"></div>
                        <div className="flex-1">
                            <div className="space-y-3">
                                {rawData.categoryDistribution.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 ronded-full`} 
                                                style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] }}>
                                            </div>
                                            <span className="font-medium text-slate-700">{item.category}</span>
                                        </div>
                                        <span className="font-bold text-slate-800">{formatRupiah(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-600 text-sm">
                    <p>Dashboard diperbarui secara real-time • Data dari FastAPI Backend</p>
                </div>
            </div>
        </div>
    );
};

export default DataVisualizationDahsboard;