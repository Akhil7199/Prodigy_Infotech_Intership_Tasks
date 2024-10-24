const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/authMiddleware');

// Get all employees
router.get('/', authMiddleware, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a specific employee by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new employee
router.post('/', authMiddleware, async (req, res) => {
    const { name, email, position, salary, dateOfJoining } = req.body;

    try {
        const newEmployee = new Employee({
            name,
            email,
            position,
            salary,
            dateOfJoining,
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update an employee
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, position, salary, dateOfJoining } = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, position, salary, dateOfJoining },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete an employee
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
