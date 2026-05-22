// Employee routes - all protected (require login)
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// All employee routes need valid JWT token
router.use(protect);

router.route('/')
  .get(getAllEmployees)
  .post(addEmployee);

router.route('/:id')
  .get(getEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
