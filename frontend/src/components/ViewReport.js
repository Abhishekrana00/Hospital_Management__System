import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ViewReport.css';

const ViewReport = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Mock data for different reports
  const mockReports = {
    patientSummary: {
      title: 'Patient Summary Report',
      description: 'Overview of patient demographics and statistics',
      data: {
        totalPatients: 1250,
        newPatients: 45,
        activePatients: 1100,
        dischargedPatients: 150,
        averageAge: 42.5,
        genderDistribution: {
          male: 52,
          female: 48
        },
        topDiagnoses: [
          { condition: 'Hypertension', count: 180, percentage: 14.4 },
          { condition: 'Diabetes', count: 120, percentage: 9.6 },
          { condition: 'Common Cold', count: 95, percentage: 7.6 },
          { condition: 'Arthritis', count: 80, percentage: 6.4 },
          { condition: 'Migraine', count: 65, percentage: 5.2 }
        ]
      }
    },
    appointmentStats: {
      title: 'Appointment Statistics Report',
      description: 'Detailed analysis of appointment patterns and trends',
      data: {
        totalAppointments: 500,
        completedAppointments: 450,
        cancelledAppointments: 30,
        noShowAppointments: 20,
        averageWaitTime: 15,
        peakHours: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'],
        departmentStats: [
          { department: 'Cardiology', appointments: 120, revenue: 45000 },
          { department: 'Orthopedics', appointments: 95, revenue: 38000 },
          { department: 'Pediatrics', appointments: 85, revenue: 25000 },
          { department: 'Dermatology', appointments: 70, revenue: 20000 },
          { department: 'Neurology', appointments: 60, revenue: 35000 }
        ]
      }
    },
    financialReport: {
      title: 'Financial Performance Report',
      description: 'Revenue, expenses, and profitability analysis',
      data: {
        totalRevenue: 250000,
        totalExpenses: 180000,
        netProfit: 70000,
        profitMargin: 28,
        revenueByMonth: [
          { month: 'January', revenue: 22000, expenses: 15000 },
          { month: 'February', revenue: 25000, expenses: 16000 },
          { month: 'March', revenue: 28000, expenses: 17000 },
          { month: 'April', revenue: 30000, expenses: 18000 },
          { month: 'May', revenue: 32000, expenses: 19000 },
          { month: 'June', revenue: 35000, expenses: 20000 }
        ],
        topRevenueSources: [
          { source: 'Consultations', amount: 120000, percentage: 48 },
          { source: 'Procedures', amount: 80000, percentage: 32 },
          { source: 'Laboratory Tests', amount: 30000, percentage: 12 },
          { source: 'Pharmacy', amount: 20000, percentage: 8 }
        ]
      }
    },
    staffPerformance: {
      title: 'Staff Performance Report',
      description: 'Employee productivity and performance metrics',
      data: {
        totalStaff: 85,
        doctors: 25,
        nurses: 40,
        administrative: 20,
        averagePatientLoad: 15,
        topPerformers: [
          { name: 'Dr. Sarah Johnson', department: 'Cardiology', patients: 45, rating: 4.9 },
          { name: 'Dr. Michael Chen', department: 'Orthopedics', patients: 42, rating: 4.8 },
          { name: 'Nurse Emily Davis', department: 'ICU', patients: 38, rating: 4.9 },
          { name: 'Dr. Lisa Rodriguez', department: 'Pediatrics', patients: 40, rating: 4.7 }
        ],
        departmentEfficiency: [
          { department: 'Emergency', efficiency: 95, patientSatisfaction: 4.6 },
          { department: 'Surgery', efficiency: 92, patientSatisfaction: 4.8 },
          { department: 'Cardiology', efficiency: 90, patientSatisfaction: 4.7 },
          { department: 'Pediatrics', efficiency: 88, patientSatisfaction: 4.9 }
        ]
      }
    }
  };

  const reportTypes = [
    { value: 'patientSummary', label: 'Patient Summary' },
    { value: 'appointmentStats', label: 'Appointment Statistics' },
    { value: 'financialReport', label: 'Financial Report' },
    { value: 'staffPerformance', label: 'Staff Performance' }
  ];

  const handleReportChange = (reportType) => {
    setSelectedReport(reportType);
    setReportData(null);
  };

  const generateReport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setReportData(mockReports[selectedReport]);
      setIsLoading(false);
    }, 1500);
  };

  const exportReport = (format) => {
    if (!reportData) {
      alert('No report data to export');
      return;
    }
    
    alert(`Exporting ${reportData.title} as ${format.toUpperCase()}`);
    // In a real application, this would generate and download the file
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="view-report">
      <header className="report-header">
        <nav className="report-nav">
          <div className="nav-brand">
            <h1>🏥 MedCare Hospital</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/search">Search Records</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </nav>
      </header>

      <div className="report-container">
        <div className="report-section">
          <h2>Hospital Reports & Analytics</h2>
          <p>Generate comprehensive reports to analyze hospital performance and trends</p>
          
          <div className="report-controls">
            <div className="control-group">
              <label htmlFor="reportType">Select Report Type:</label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={(e) => handleReportChange(e.target.value)}
                className="report-select"
              >
                <option value="">Choose a report...</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="date-input"
              />
            </div>

            <div className="control-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="date-input"
              />
            </div>

            <button 
              onClick={generateReport} 
              className="generate-btn"
              disabled={!selectedReport || isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="report-results">
            <div className="report-header-section">
              <h3>{reportData.title}</h3>
              <p>{reportData.description}</p>
              <div className="export-buttons">
                <button onClick={() => exportReport('pdf')} className="export-btn pdf">
                  📄 Export PDF
                </button>
                <button onClick={() => exportReport('excel')} className="export-btn excel">
                  📊 Export Excel
                </button>
                <button onClick={() => exportReport('csv')} className="export-btn csv">
                  📋 Export CSV
                </button>
              </div>
            </div>

            <div className="report-content">
              {selectedReport === 'patientSummary' && (
                <div className="report-grid">
                  <div className="stat-cards">
                    <div className="stat-card">
                      <h4>Total Patients</h4>
                      <div className="stat-number">{formatNumber(reportData.data.totalPatients)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>New Patients</h4>
                      <div className="stat-number">{formatNumber(reportData.data.newPatients)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Active Patients</h4>
                      <div className="stat-number">{formatNumber(reportData.data.activePatients)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Average Age</h4>
                      <div className="stat-number">{reportData.data.averageAge} years</div>
                    </div>
                  </div>

                  <div className="chart-section">
                    <h4>Gender Distribution</h4>
                    <div className="gender-chart">
                      <div className="gender-bar">
                        <div className="bar-label">Male</div>
                        <div className="bar-container">
                          <div className="bar-fill male" style={{width: `${reportData.data.genderDistribution.male}%`}}></div>
                          <span className="bar-percentage">{reportData.data.genderDistribution.male}%</span>
                        </div>
                      </div>
                      <div className="gender-bar">
                        <div className="bar-label">Female</div>
                        <div className="bar-container">
                          <div className="bar-fill female" style={{width: `${reportData.data.genderDistribution.female}%`}}></div>
                          <span className="bar-percentage">{reportData.data.genderDistribution.female}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-section">
                    <h4>Top Diagnoses</h4>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Condition</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.topDiagnoses.map((diagnosis, index) => (
                          <tr key={index}>
                            <td>{diagnosis.condition}</td>
                            <td>{diagnosis.count}</td>
                            <td>{diagnosis.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedReport === 'appointmentStats' && (
                <div className="report-grid">
                  <div className="stat-cards">
                    <div className="stat-card">
                      <h4>Total Appointments</h4>
                      <div className="stat-number">{formatNumber(reportData.data.totalAppointments)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Completed</h4>
                      <div className="stat-number">{formatNumber(reportData.data.completedAppointments)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Cancelled</h4>
                      <div className="stat-number">{formatNumber(reportData.data.cancelledAppointments)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Average Wait Time</h4>
                      <div className="stat-number">{reportData.data.averageWaitTime} min</div>
                    </div>
                  </div>

                  <div className="table-section">
                    <h4>Department Statistics</h4>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Appointments</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.departmentStats.map((dept, index) => (
                          <tr key={index}>
                            <td>{dept.department}</td>
                            <td>{dept.appointments}</td>
                            <td>{formatCurrency(dept.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedReport === 'financialReport' && (
                <div className="report-grid">
                  <div className="stat-cards">
                    <div className="stat-card">
                      <h4>Total Revenue</h4>
                      <div className="stat-number">{formatCurrency(reportData.data.totalRevenue)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Total Expenses</h4>
                      <div className="stat-number">{formatCurrency(reportData.data.totalExpenses)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Net Profit</h4>
                      <div className="stat-number profit">{formatCurrency(reportData.data.netProfit)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Profit Margin</h4>
                      <div className="stat-number">{reportData.data.profitMargin}%</div>
                    </div>
                  </div>

                  <div className="table-section">
                    <h4>Revenue by Month</h4>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Revenue</th>
                          <th>Expenses</th>
                          <th>Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.revenueByMonth.map((month, index) => (
                          <tr key={index}>
                            <td>{month.month}</td>
                            <td>{formatCurrency(month.revenue)}</td>
                            <td>{formatCurrency(month.expenses)}</td>
                            <td className={month.revenue - month.expenses > 0 ? 'positive' : 'negative'}>
                              {formatCurrency(month.revenue - month.expenses)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedReport === 'staffPerformance' && (
                <div className="report-grid">
                  <div className="stat-cards">
                    <div className="stat-card">
                      <h4>Total Staff</h4>
                      <div className="stat-number">{formatNumber(reportData.data.totalStaff)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Doctors</h4>
                      <div className="stat-number">{formatNumber(reportData.data.doctors)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Nurses</h4>
                      <div className="stat-number">{formatNumber(reportData.data.nurses)}</div>
                    </div>
                    <div className="stat-card">
                      <h4>Avg Patient Load</h4>
                      <div className="stat-number">{reportData.data.averagePatientLoad}</div>
                    </div>
                  </div>

                  <div className="table-section">
                    <h4>Top Performers</h4>
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Patients</th>
                          <th>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.data.topPerformers.map((performer, index) => (
                          <tr key={index}>
                            <td>{performer.name}</td>
                            <td>{performer.department}</td>
                            <td>{performer.patients}</td>
                            <td>⭐ {performer.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReport;
