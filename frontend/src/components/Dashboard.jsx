import { useRef, useState } from "react";

const DataVisualizationDahsboard = () => {
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedChart, setSelectedChart] = useState('revenue');

    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const pieChartRef = useRef(null);
}