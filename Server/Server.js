const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const PORT = 3000;
const SECRET_KEY = "your_secret_key";

const app = express();
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize("doctor_booking", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Booking = sequelize.define("Booking", {
  doctorName: { type: DataTypes.STRING, allowNull: false },
  appointmentDate: { type: DataTypes.STRING, allowNull: false },
  appointmentTime: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Booking);
Booking.belongsTo(User);

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: "Registration failed", details: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: "Login failed", details: error.message });
  }
});

app.get("/user", async (req, res) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch user", details: error.message });
  }
});

app.post("/bookings", async (req, res) => {
  const { token } = req.headers;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const { doctorName, appointmentDate, appointmentTime } = req.body;

    const newBooking = await Booking.create({
      UserId: decoded.id,
      doctorName: doctorName,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ error: "Failed to create booking", details: error.message });
  }
});

app.get("/bookings", async (req, res) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const bookings = await Booking.findAll({
      where: { UserId: decoded.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(400).json({ error: "Failed to fetch bookings", details: error.message });
    }
  }
});

app.delete("/bookings/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const booking = await Booking.findOne({
      where: { 
        id: id,
        UserId: decoded.id 
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.destroy();
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to cancel booking", details: error.message });
  }
});

app.put("/bookings/:id", async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  const { appointmentDate, appointmentTime } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const booking = await Booking.findOne({
      where: { 
        id: id,
        UserId: decoded.id 
      }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.update({
      appointmentDate,
      appointmentTime
    });

    res.json({ message: "Booking rescheduled successfully", booking });
  } catch (error) {
    res.status(400).json({ error: "Failed to reschedule booking", details: error.message });
  }
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
})();
