// Employee controller - CRUD operations for employees
const Employee = require('../models/Employee');

// @route   POST /api/employees
// @desc    Add a new employee
const addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      email,
      phone,
      department,
      jobPosition,
      salary,
      joiningDate,
    } = req.body;

    // Required field validation
    if (
      !employeeId ||
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !jobPosition ||
      salary === undefined ||
      salary === '' ||
      !joiningDate
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existing = await Employee.findOne({
      employeeId: employeeId.toUpperCase().trim(),
    });

    if (existing) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const employee = await Employee.create({
      employeeId: employeeId.toUpperCase().trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department: department.trim(),
      jobPosition: jobPosition.trim(),
      salary: Number(salary),
      joiningDate: new Date(joiningDate),
    });

    res.status(201).json({
      message: 'Employee added successfully',
      employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee ID or email already exists' });
    }
    console.error('Add employee error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @route   GET /api/employees
// @desc    Get all employees (optional search query)
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, employeeId } = req.query;
    let filter = {};

    // Search by name (partial match, case insensitive)
    if (search) {
      filter.fullName = { $regex: search, $options: 'i' };
    }

    // Filter by department
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }

    // Filter by employee ID
    if (employeeId) {
      filter.employeeId = { $regex: employeeId.toUpperCase(), $options: 'i' };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    res.json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/employees/:id
// @desc    Get single employee by MongoDB id
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/employees/:id
// @desc    Update employee details
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const {
      employeeId,
      fullName,
      email,
      phone,
      department,
      jobPosition,
      salary,
      joiningDate,
    } = req.body;

    // Check duplicate employee ID if changed
    if (employeeId && employeeId.toUpperCase() !== employee.employeeId) {
      const duplicate = await Employee.findOne({
        employeeId: employeeId.toUpperCase().trim(),
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Employee ID already in use' });
      }
      employee.employeeId = employeeId.toUpperCase().trim();
    }

    if (fullName) employee.fullName = fullName.trim();
    if (email) employee.email = email.trim().toLowerCase();
    if (phone) employee.phone = phone.trim();
    if (department) employee.department = department.trim();
    if (jobPosition) employee.jobPosition = jobPosition.trim();
    if (salary !== undefined && salary !== '') employee.salary = Number(salary);
    if (joiningDate) employee.joiningDate = new Date(joiningDate);

    const updated = await employee.save();

    res.json({
      message: 'Employee updated successfully',
      employee: updated,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.deleteOne();

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
