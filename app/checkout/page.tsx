"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { state: { items: cart }, dispatch } = useCart();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      router.push("/cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          deliveryDate,
          address,
          totalAmount: Number(total.toFixed(2)),
          paymentMethod: "COD",
          items: cart.map((item) => ({
            productId: String(item.id),
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        })
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      setSuccess(true);
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <Box sx={{ p: 6, textAlign: "center", color: "#94a3b8" }}>Please sign in to checkout.</Box>;
  }

  if (success) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', color: '#fff' }}>
        <Typography variant="h4" sx={{ color: '#4ade80', mb: 2 }}>Order Placed Successfully!</Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
          Thank you for your purchase. You will pay Cash on Delivery.
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "sm", mx: "auto", color: "#e2e8f0" }}>
      <Typography variant="h4" sx={{ mb: 4, color: "#fff", fontWeight: "bold" }}>Checkout</Typography>
      
      <form onSubmit={handlePlaceOrder}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Delivery Address</Typography>
          <TextField 
            fullWidth 
            required
            multiline
            rows={3}
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ input: { color: "#fff" }, textarea: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { bgcolor: "#0f172a", color: "#e2e8f0", borderRadius: 2, "& fieldset": { borderColor: "#334155" } } }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Expected Delivery Date</Typography>
          <TextField 
            fullWidth 
            required
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            sx={{ input: { color: "#fff" }, label: { color: "#94a3b8" }, "& .MuiOutlinedInput-root": { bgcolor: "#0f172a", color: "#e2e8f0", borderRadius: 2, "& fieldset": { borderColor: "#334155" } }, "& input[type='date']::-webkit-calendar-picker-indicator": { filter: "invert(1)" } }}
          />
        </Box>

        <Box sx={{ mb: 4, p: 3, bgcolor: "#0f172a", border: "1px solid #334155", borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>Payment Method</Typography>
          <Typography variant="body2" sx={{ color: "#4ade80" }}>Cash on Delivery (COD) Selected</Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>You will pay when the order arrives.</Typography>
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          size="large"
          disabled={loading}
          sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" }, borderRadius: 3, textTransform: "none", fontWeight: 700 }}
        >
          {loading ? "Processing..." : "Place Order (COD)"}
        </Button>
      </form>
    </Box>
  );
}
