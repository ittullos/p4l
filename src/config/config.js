const CONFIG = {
  SERVER_URL:
    process.env.NODE_ENV === "production"
      ? "https://pray4tn-1909e243cd5b.herokuapp.com"
      : "http://localhost:9292",
};

export default CONFIG;
