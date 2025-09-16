import React from 'react';

const DashboardChart = ({ 
  title, 
  data = [], 
  type = 'line', 
  height = 300  
}) => {
  // Simple chart component - in real app, use Chart.js or similar
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">{title}</h6>
      </div>
      <div className="card-body">
        <div style={{ height: height }}>
          {type === 'bar' ? (
            <div className="d-flex align-items-end justify-content-around h-100">
              {data.map((item, index) => (
                <div key={index} className="d-flex flex-column align-items-center">
                  <div 
                    className="bg-primary rounded"
                    style={{
                      width: '20px',
                      height: `${(item.value / maxValue) * 80}%`,
                      minHeight: '10px'
                    }}
                  ></div>
                  <small className="mt-2 text-muted">{item.label}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <p className="text-muted">Chart visualization would go here</p>
                <small className="text-muted">Integrate with Chart.js or similar library</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
