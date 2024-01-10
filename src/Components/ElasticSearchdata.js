import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import Sidebar from '../Layout';
// import { useTheme } from './ThemeContext';

const CustomerList = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  // const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Render the charts whenever data changes
    renderBarChart();
    renderPieChart();
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9200/netflix/_search', {
        auth: {
          username: 'elastic',
          password: '7wuYGcQevuEdNOs+xzS+',
        },
      });
      setData(response.data.hits.hits.map(hit => hit._source));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderBarChart = () => {
    // Assuming release_year is an array of release years
    const releaseYears = data.map(item => item.release_year);

    const svg = d3.select(chartRef.current);

    // Clear previous chart
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x.domain(releaseYears);
    y.domain([0, d3.max(releaseYears, d => d)]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Count');

    g.selectAll('.bar')
      .data(releaseYears)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d))
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d));
  };

  const renderPieChart = () => {
    // Assuming type is an array of show types
    const types = data.map(item => item.type);

    const svg = d3.select(chartRef.current);

    // Clear previous chart
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie();
    const arc = d3.arc().outerRadius(radius).innerRadius(0);

    const pieData = d3.pie()(types.map(type => types.filter(t => t === type).length));

    const arcs = g.selectAll('.arc')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data);

  };

  return (
    <div
    style={{
      background:   "#2F3349" ,
      
      minHeight: "100vh",
    }}
  > 
    <Sidebar/>
    <div>
      <h1>Customer List</h1>
      <ul>
        {data.map((item,index) => (
          <li key={index}>
            <strong>Cast:</strong> {item.cast}, <strong>Country:</strong> {item.country}, <strong>Time Added:</strong> {item.date_added}, <strong>{item.description}</strong>,
            <strong>{item.director}</strong>, <strong>{item.duration}</strong>,<strong>{item.listed_in}</strong>,<strong>{item.rating}</strong>,<strong>{item.release_year}</strong>,
            <strong>{item.show_id}</strong>,<strong>{item.title}</strong>,<strong>{item.type}</strong>
          </li>
        ))}
      </ul>
      <svg ref={chartRef}></svg>
    </div>
    </div>
  );
};

export default CustomerList;
