const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function savePortfolio(data) {
  const { data: row, error } = await db
    .from("portfolios")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row;
}

async function getPortfolio(id) {
  const { data, error } = await db
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

async function listPortfolios() {
  const { data, error } = await db
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function updatePortfolio(id, data) {
  const { data: row, error } = await db
    .from("portfolios")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return row;
}

async function deletePortfolio(id) {
  const { error } = await db.from("portfolios").delete().eq("id", id);
  if (error) throw error;
}

async function uploadPhoto(file) {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const { error } = await db.storage
    .from("profile-pictures")
    .upload(path, file);
  if (error) throw error;
  return db.storage.from("profile-pictures").getPublicUrl(path).data.publicUrl;
}
