import { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LuPhoneCall } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { ShopContext } from "../context/ShopContext"; 
import "./Contact.css";

const Contact = () => {
  const { backendUrl } = useContext(ShopContext); // Access backendUrl from context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!/^[A-Za-z\s]{3,}$/.test(formData.name)) {
      toast.error("Invalid name! Must be at least 3 letters.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format.");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Invalid phone number! Must be 10 digits.");
      return false;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const toastId = toast.loading("Sending message...");

    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    try {
      // Send email via EmailJS
      await emailjs.send(
        "service_sge3b8o",
        "template_g6e6iqw",
        emailParams,
        "b5yXn9zWuQb3zO3GW"
      );

      // Send data to backend API
      await axios.post(`${backendUrl}/api/contact/submit`, formData);

      toast.success("Message sent successfully!", { id: toastId });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="contact-info">
        <div className="info-item">
          <i className="icon"><LuPhoneCall /></i>
          <h3>Call To Us</h3>
          <p>We are available 24/7, 7 days a week.</p>
          <p>Phone: +91 88091 97377</p>
        </div>
        <div className="info-item">
          <i className="icon"><TfiEmail /></i>
          <h3>Write To Us</h3>
          <p>Fill out our form, and we will contact you within 24 hours.</p>
          <p>Email: customer@shoper.com</p>
          <p>Email: support@shoper.com</p>
        </div>
      </div>

      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="name" placeholder="Your Name *" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email *" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Your Phone *" value={formData.phone} onChange={handleChange} required />
          </div>
          <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
