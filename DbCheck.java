import java.sql.*;

public class DbCheck {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:postgresql://dpg-d737e315pdvs73f953g0-a:5432/servicehub_8afx?sslmode=require&user=servicehub_8afx_user&password=o506MiHmeuO7cROLvZBMeOj2wyevJHNm";
    try (Connection conn = DriverManager.getConnection(url)) {
      String sql = "select id, full_name, email, role, active, profile_image from users where role = 'ADMIN' order by id";
      try (PreparedStatement ps = conn.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
          System.out.println(rs.getLong("id") + " | " + rs.getString("full_name") + " | " + rs.getString("email") + " | " + rs.getString("role") + " | active=" + rs.getBoolean("active") + " | profileImage=" + rs.getString("profile_image"));
        }
      }
    }
  }
}
