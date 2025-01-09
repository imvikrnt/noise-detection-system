import bcrypt from 'bcrypt';
import  db  from '../database/db.js';

export const Register = (req, res) => {

    console.log('Received data:', req.body);
    // get data from backend to check user exists or not
    const q = "SELECT * FROM nds_project7.user WHERE email = ?";

    db.query(q, [req.body.email], async (err, data) => {
        if (err) return res.status(500).json({ Error: "Registration Error in Server" });
        if (data.length) return res.status(409).json("User already exists!");
        
        //CREATE A NEW USER
        //Hash the password
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;
        const dob = req.body.dob;
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        console.log(name, phone, email, dob, password)

        const sql = "INSERT INTO nds_project7.user (`name`,`phone`, `email`, `dob`,`password`) VALUES (?)"
        const values = [
            name,
            phone,
            email,
            dob,
            password
        ]
        db.query(sql, [values], (err, data) => {
            if (err) return res.status(500).json({ Error: "Inserting Register data error in server side" });
           
            res.status(200).json({ status: "Success" });
        })
    });
};
export const Login = (req, res) => {
    console.log(req.body.password, req.body.email)
    const sql = "SELECT * FROM nds_project7.user WHERE email = ?";

    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json({ Error: "Login Error in Server" });

        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.status(500).json({ Error: "Password compare error in Server" });

                if (response) {
                    const id = data[0].id;
                    const user = {                       
                        email: data[0].email,
                    };
                    res.status(200).json({
                        status: "Success",
                        id,
                        user
                    });

                } else {
                    return res.status(400).json({  status: "Failed", Error: "Password not matched!!" });
                }
            });
        } else {
            return res.status(404).json({ Error: "No username existed" });
        }
    });
};


