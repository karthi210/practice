const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(async function() {
    const { Employees, LeaveRequests, Payslips } = this.entities;
    
    // Mock data for practice
    const mockEmployees = [
        { ID: '1', name: 'John Doe', department: 'IT', leaveBalance: 15 },
        { ID: '2', name: 'Jane Smith', department: 'HR', leaveBalance: 12 },
        { ID: '3', name: 'Bob Johnson', department: 'Finance', leaveBalance: 18 }
    ];
    
    const mockLeaves = [
        { ID: '1', employeeId: '1', type: 'Annual', startDate: '2024-03-01', endDate: '2024-03-05', status: 'Approved' },
        { ID: '2', employeeId: '2', type: 'Sick', startDate: '2024-03-10', endDate: '2024-03-10', status: 'Pending' }
    ];
    
    // GET all employees
    this.on('READ', Employees, async (req) => {
        // In real scenario, call SAP OData API
        // const sapResponse = await callSAPOData('/Employees');
        // return sapResponse.data.d.results;
        
        // For practice, return mock data
        return mockEmployees;
    });
    
    // GET employee by ID
    this.on('READ', Employees, async (req) => {
        const id = req.params[0].ID;
        const employee = mockEmployees.find(emp => emp.ID === id);
        return employee ? [employee] : [];
    });
    
    // CREATE leave request
    this.on('CREATE', LeaveRequests, async (req) => {
        const leave = req.data;
        leave.ID = (mockLeaves.length + 1).toString();
        leave.status = 'Pending';
        mockLeaves.push(leave);
        
        // In real scenario, call SAP to create leave request
        // await axios.post(process.env.SAP_LEAVE_API, leave);
        
        return leave;
    });
    
    // GET payslips
    this.on('READ', Payslips, async (req) => {
        // Mock payslip data
        return [
            { ID: '1', employeeId: '1', month: 'February 2024', amount: 5000, downloadUrl: '/payslips/1.pdf' },
            { ID: '2', employeeId: '1', month: 'January 2024', amount: 5000, downloadUrl: '/payslips/2.pdf' }
        ];
    });
    
    // Health check endpoint
    this.on('health', async () => {
        return { status: 'OK', timestamp: new Date().toISOString() };
    });
});

// Helper function to call SAP OData (for practice)
async function callSAPOData(endpoint) {
    try {
        const response = await axios.get(
            `${process.env.SAP_BASE_URL}${endpoint}`,
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(
                        `${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`
                    ).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('SAP API Error:', error.message);
        throw error;
    }
}