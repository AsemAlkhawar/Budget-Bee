import React from 'react'; // Import React
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // Import components from recharts library
import './styles/PieChartDisplay.css'; // Import CSS styles for PieChartDisplay
import './styles/styles.css'; // Import general CSS styles

const COLORS = ['#FFD700', '#FFCC00', '#FFB700', '#FFA500', '#FF8C00', '#FF7F00']; // Define color palette for pie chart

const PieChartDisplay = ({ title, data }) => { // Define PieChartDisplay component with title and data props
    return (
        <div className="pie-chart-container"> {/* Container for the pie chart */}
            <h3>{title}</h3> {/* Title of the pie chart */}
            <PieChart width={600} height={400}> {/* Define dimensions of the pie chart */}
                <Pie
                    data={data} // Data for the pie chart
                    dataKey="value" // Key for the value in the data
                    nameKey="name" // Key for the name in the data
                    cx="50%" // X-coordinate of the center of the pie chart
                    cy="50%" // Y-coordinate of the center of the pie chart
                    innerRadius={35} // Inner radius of the pie chart
                    outerRadius={140} // Outer radius of the pie chart
                    paddingAngle={1} // Padding angle between slices
                    cornerRadius={10} // Corner radius of the slices
                    startAngle={0} // Start angle of the pie chart
                    endAngle={360} // End angle of the pie chart
                    labelLine={false} // Disable label lines
                >
                    {data.map((entry, index) => ( // Map through data to create cells
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // Assign color to each cell
                    ))}
                </Pie>
                <Tooltip /> {/* Tooltip for displaying data on hover */}
                <Legend layout="vertical" verticalAlign="middle" align="right" /> {/* Legend for the pie chart */}
            </PieChart>
        </div>
    );
};

export default PieChartDisplay; // Export the PieChartDisplay component as default