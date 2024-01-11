import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import Sidebar from '../Layout';
import Navbar from '../Layout/Navbar';
// import { useTheme } from './ThemeContext';
import './index.css'

import '../css/_app.css';

import '../css/_card.css';

const CustomerList = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // drawLineChart(data)
    d3.select('.chart-area').selectAll('*').remove();
    if (data.length > 0) {
      drawLineChart();
      drawBarChart();
      drawDonutChart();
      drawScatterPlot();
    }
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
      console.log(response.data.hits.hits.map(hit => hit._source))
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const drawLineChart = () => {
    
    const parseDate = d3.timeParse('%B %d, %Y');

    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('.chart-area').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data by date
    data.sort((a, b) => parseDate(a.date_added) - parseDate(b.date_added));

    // Set up scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, d => parseDate(d.date_added)));
    y.domain([0, d3.max(data, d => parseInt(d.duration, 10))]);

    // Define the line
    const line = d3.line()
      .x(d => x(parseDate(d.date_added)))
      .y(d => y(parseInt(d.duration, 10)));

    // Append the line
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', line);

    // Add the X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Duration');

    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Date');
  };

  const drawBarChart = () => {
    
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('.chart-area').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(data.map(d => d.show_id));
    y.domain([0, d3.max(data, d => parseInt(d.duration, 10))]);

    // Append the bars
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.show_id))
      .attr('width', x.bandwidth())
      .attr('y', d => y(parseInt(d.duration, 10)))
      .attr('height', d => height - y(parseInt(d.duration, 10)));

    // Add the X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Duration');

    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('ID');
  };

  // const drawPieChart = () => {
  //   const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  //   const width = 500 - margin.left - margin.right;
  //   const height = 300 - margin.top - margin.bottom;
  //   const radius = Math.min(width, height) / 2;

  //   const svg = d3.select('.chart-area').append('svg')
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', `translate(${width / 2},${height / 2})`);

  //   const color = d3.scaleOrdinal(d3.schemeCategory10);

  //   const pie = d3.pie()
  //     .value(d => d.count)
  //     .sort(null);

  //   const path = d3.arc()
  //     .outerRadius(radius - 10)
  //     .innerRadius(0);

  //   const dataForPieChart = d3.rollup(data, d => d.length, d => d.country);

  //   const dataForPieChartArray = Array.from(dataForPieChart, ([key, value]) => ({ country: key, count: value }));

  //   const arc = svg.selectAll('.arc')
  //     .data(pie(dataForPieChartArray))
  //     .enter().append('g')
  //     .attr('class', 'arc');

  //   arc.append('path')
  //     .attr('d', path)
  //     .attr('fill', d => color(d.data.country));

  //   arc.append('text')
  //     .attr('transform', d => `translate(${path.centroid(d)})`)
  //     .attr('dy', '0.35em')
  //     .text(d => d.data.country);
  // };
  const drawDonutChart = () => {
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;
  
    const svg = d3.select('.chart-area').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);
  
    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius / 2);
  
    const dataForDonutChart = d3.rollup(data, d => d.length, d => d.country);
  
    const dataForDonutChartArray = Array.from(dataForDonutChart, ([key, value]) => ({ country: key, count: value }));
  
    const arcs = pie(dataForDonutChartArray);
  
    // Add a tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
  
    // Draw arcs with animations
    svg.selectAll('.arc')
      .data(arcs)
      .enter().append('path')
      .attr('class', 'arc')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`${d.data.country}: ${d.data.count}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });
  
    // Add text labels with animations
    svg.selectAll('text')
      .data(arcs)
      .enter().append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.country)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('user-select', 'none');
  };
  
  

  const drawScatterPlot = () => {
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('.chart-area').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, d => parseInt(d.release_year, 10)));
    y.domain(d3.extent(data, d => parseInt(d.rating, 10)));

    svg.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', 5)
      .attr('cx', d => x(parseInt(d.release_year, 10)))
      .attr('cy', d => y(parseInt(d.rating, 10)))
      .style('fill', 'blue');

    // Add the X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Rating');

    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Release Year');
  };

  return (
    <div
  > 
    <Navbar/>
    <Sidebar/>
    <section className="section main-section">
    <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6 ml-[10rem]">

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="widget-label">
              <h3>
                Clients
              </h3>
              <h1>
                512
              </h1>
            </div>
            <span className="icon widget-icon text-green-500"><svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/></svg></span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="widget-label">
              <h3>
                Sales
              </h3>
              <h1>
                $7,770
              </h1>
            </div>
            <span className="icon widget-icon text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/></svg></span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div className="widget-label">
              <h3>
                Performance
              </h3>
              <h1>
                256%
              </h1>
            </div>
            <span className="icon widget-icon text-red-500"><svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg></span>
          </div>
        </div>
      </div>
    </div>

    <div className="card mb-6 ml-[10rem]">
      <header className="card-header">
        <p className="card-header-title">
          <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg></span>
          Performance
        </p>
        <a href="#" className="card-header-icon">
          <span className="icon"><i className="mdi mdi-reload"></i></span>
        </a>
      </header>
      <div className="card-content">
      <div className="chart-area grid grid-cols-2 gap-8 mb-8">
            <div className="h-full" ref={chartRef}></div>
          </div>
      </div>
    </div>
    </section>
    
    </div>
  );
};

export default CustomerList;
