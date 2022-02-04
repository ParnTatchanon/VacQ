const express = require('express');
const {getHospital, getHospitals, createHospitals, updateHospital,deleteHospital} = require('../controllers/hospitals');
const router = express.Router();

router.route('/').get(getHospitals).post(createHospitals);
router.route('/:id').get(getHospital).put(updateHospital).delete(deleteHospital);

module.exports=router;