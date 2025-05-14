const express = require("express");


const router = express.Router();

router.get("/", (_, res)=> {
    res.json({
        phone: "+49 30 915-88492",
        address: "Wallstraẞe 9-13, 10179 Berlin, Deutschland",
        working_hours: "24 hours a day",
        socials: {
            instagram: "https://instagram.com",
            whatsApp: "httts://whatsapp.com"
        }
    })
});

module.exports = router;