import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LabelBadge, FilterChip } from '../../components/Badge';
import { StatCard, CardHeader } from '../../components/Card';
import { TableRow, TableCell } from '../../components/Table';
import Modal, { ModalFooter } from '../../components/Modal';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { Button } from '../../components/ui/button';
import Container, { PageSection } from '../../components/Container';
import { TableFooter } from '../../components/Footer';
import { LoaderCircleIcon } from 'lucide-react';

function fmtDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Avatar({ name }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div className="w-8 h-8 rounded-full bg-accent-blue-shadow text-primary-3 flex items-center justify-center text-xs font-bold font-inter flex-shrink-0">
      {initials}
    </div>
  );
}

const emptyForm = { name: '', email: '', password: '', role: 'user' };

function IconEdit()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>; }
function IconTrash() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>; }

export default function Users() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [filter, setFilter]       = useState('All');
  const [showAdd, setShowAdd]     = useState(false);
  const [showEdit, setShowEdit]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [formError, setFormError] = useState('');

  /* ── Fetch users dari Supabase profiles table ── */
  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    filter === 'All' ? true : u.role === filter
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  }

  /* ── Add: Admin membuat user baru ── */
  async function handleAddSubmit(e) {
    e.preventDefault();
    if (!form.email.trim())   { setFormError('Email wajib diisi.'); return; }
    if (!form.password || form.password.length < 8) {
      setFormError('Password minimal 8 karakter.'); return;
    }

    setSaving(true);
    setFormError('');
    try {
      // signUp membuat user di auth.users, trigger otomatis insert ke profiles
      const { data, error } = await supabase.auth.signUp({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        options:  { data: { name: form.name.trim() || '' } },
      });

      if (error) { setFormError(error.message); return; }

      // Jika role bukan 'user', update setelah trigger selesai
      if (form.role !== 'user' && data?.user?.id) {
        // Tunggu sebentar agar trigger selesai insert
        await new Promise(r => setTimeout(r, 500));
        await supabase.from('profiles').update({ role: form.role }).eq('id', data.user.id);
      }

      await fetchUsers();
      setShowAdd(false);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }

  /* ── Edit: update role & nama di profiles ── */
  function openEdit(u) {
    setSelected(u);
    setForm({ name: u.name || '', email: u.email || '', role: u.role || 'user' });
    setFormError('');
    setShowEdit(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ name: form.name.trim() || null, role: form.role })
        .eq('id', selected.id)
        .select();

      console.log('UPDATE result:', { data, error, selectedId: selected.id, form });

      if (error) { setFormError(error.message); return; }
      if (!data || data.length === 0) {
        setFormError('Update tidak berpengaruh — cek RLS policy di Supabase.');
        return;
      }
      await fetchUsers();
      setShowEdit(false);
      setSelected(null);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete: hapus dari profiles ── */
  function openDelete(u) { setSelected(u); setShowDelete(true); }

  async function handleDeleteConfirm() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selected.id);

      if (error) { alert(error.message); return; }
      await fetchUsers();
      setShowDelete(false);
      setSelected(null);
    } finally {
      setSaving(false);
    }
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount  = users.filter(u => u.role === 'user').length;

  return (
    <Container>
      <PageSection cols={3} gap="sm">
        <StatCard label="Total Users" value={users.length}
          iconBg="bg-accent-blue-shadow" iconColor="text-accent-blue"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}/>
        <StatCard label="Admin" value={adminCount}
          iconBg="bg-accent-yellow-shadow" iconColor="text-accent-yellow"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}/>
        <StatCard label="User Biasa" value={userCount}
          iconBg="bg-accent-green-shadow" iconColor="text-accent-green"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}/>
      </PageSection>

      <div className="rounded-2xl overflow-hidden bg-neutral border border-neutral-border">
        <CardHeader
          title="Manajemen User"
          subtitle="Data diambil langsung dari Supabase"
          action={
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'admin', 'user'].map(f => (
                <FilterChip key={f} label={f === 'All' ? 'Semua' : f} active={filter === f} onClick={() => setFilter(f)} />
              ))}
              <Button size="sm" variant="default" onClick={() => { setForm(emptyForm); setFormError(''); setShowAdd(true); }} className="rounded-full text-xs">
                + Tambah User
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-bg">
                {['No', 'User', 'Email', 'Role', 'Terdaftar', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold text-left text-neutral-teks font-inter">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center font-inter">
                    <div className="flex items-center justify-center gap-2 text-neutral-teks text-sm">
                      <LoaderCircleIcon className="animate-spin w-4 h-4" /> Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-teks font-inter">Tidak ada user ditemukan</td></tr>
              ) : filtered.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell><span className="text-neutral-teks">{String(i + 1).padStart(2, '0')}.</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={u.name || u.email} />
                      <span className="text-sm font-medium text-primary-2">{u.name || '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-neutral-teks">{u.email}</span></TableCell>
                  <TableCell>
                    <LabelBadge
                      label={u.role}
                      bgClass={u.role === 'admin' ? 'bg-accent-yellow-shadow' : 'bg-accent-blue-shadow'}
                      textClass={u.role === 'admin' ? 'text-accent-yellow' : 'text-accent-blue'}
                    />
                  </TableCell>
                  <TableCell><span className="text-xs text-neutral-teks">{fmtDate(u.created_at)}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-accent-blue hover:bg-accent-blue-shadow transition-colors" title="Edit">
                        <IconEdit />
                      </button>
                      <button onClick={() => openDelete(u)}
                        className="p-1.5 rounded-lg text-secondary hover:bg-accent-pink-shadow transition-colors" title="Hapus">
                        <IconTrash />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
        <TableFooter showing={filtered.length} total={users.length} label="user" />
      </div>

      {/* ── Modal Add ── */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah User" subtitle="Buat akun user baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Andi Saputra" />
          <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" required />
          <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" required />
          <SelectField label="Role" name="role" value={form.role} onChange={handleChange} options={['user', 'admin']} />
          {formError && <p className="text-xs text-secondary font-inter">{formError}</p>}
          <ModalFooter onCancel={() => setShowAdd(false)} submitLabel={saving ? 'Membuat...' : 'Buat User'} />
        </form>
      </Modal>

      {/* ── Modal Edit ── */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit User" subtitle={selected?.email}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <InputField label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Andi Saputra" />
          <div className="px-3 py-2 rounded-xl bg-neutral-bg text-xs text-neutral-teks font-inter">
            Email: <span className="font-semibold text-primary-2">{form.email}</span>
          </div>
          <SelectField label="Role" name="role" value={form.role} onChange={handleChange} options={['user', 'admin']} />
          {formError && <p className="text-xs text-secondary font-inter">{formError}</p>}
          <ModalFooter onCancel={() => setShowEdit(false)} submitLabel={saving ? 'Menyimpan...' : 'Simpan Perubahan'} />
        </form>
      </Modal>

      {/* ── Modal Delete ── */}
      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Hapus User" subtitle="Tindakan ini tidak dapat dibatalkan">
        <div className="space-y-4">
          <p className="text-sm text-neutral-teks font-inter">
            Hapus user <span className="font-semibold text-primary-2">{selected?.email}</span> dari database?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowDelete(false)} type="button"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-border text-neutral-teks bg-neutral-bg font-inter">
              Batal
            </button>
            <button onClick={handleDeleteConfirm} type="button" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-neutral hover:opacity-90 disabled:opacity-50 font-inter">
              {saving ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
