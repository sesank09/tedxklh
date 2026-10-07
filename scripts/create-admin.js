const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://wtkorkikgwwefahewbif.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0a29ya2lrZ3d3ZWZhaGV3YmlmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY4NDcwNSwiZXhwIjoyMTA2MjYwNzA1fQ.D8qxJkoaTmQT0E0e1A09xniJV8a3po3YOxxHeIbw9r4";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdminUser(email, password) {
  console.log(`Creating/Ensuring admin user for: ${email}...`);

  // Check if user already exists in auth
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  let existingUser = users ? users.find(u => u.email === email) : null;

  if (!existingUser) {
    const { data: newUser, error: createAuthErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin", name: "TEDx KLH Organizer" }
    });

    if (createAuthErr) {
      console.error("Error creating auth user:", createAuthErr.message);
      return;
    }
    existingUser = newUser.user;
    console.log("Auth user created with ID:", existingUser.id);
  } else {
    console.log("Auth user already exists with ID:", existingUser.id);
    // Update password just in case
    await supabase.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true
    });
  }

  // Insert into admin_users table
  const { data: adminRecord, error: adminErr } = await supabase
    .from("admin_users")
    .upsert({
      user_id: existingUser.id,
      email: existingUser.email,
      role: "admin"
    }, { onConflict: "user_id" })
    .select();

  if (adminErr) {
    console.error("Error adding to admin_users table:", adminErr.message);
  } else {
    console.log("Admin privileges granted successfully in admin_users table!");
  }
}

// Create default admin account
createAdminUser("tedxklh@tedxklh.com", "Sesank@9999").catch(console.error);
createAdminUser("admin@tedxklh.com", "Sesank@9999").catch(console.error);

