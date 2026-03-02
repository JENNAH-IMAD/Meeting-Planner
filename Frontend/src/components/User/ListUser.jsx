import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button, Card, CardBody, CardHeader, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem,
  useDisclosure, Chip, Avatar,
} from '@heroui/react';
import { Users, Search, Edit, Trash2, Mail, Briefcase, Shield, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { getAllUsers, updateUser, deleteUser } from '../../services/UserService';
import { isAdminUser } from '../../services/AuthService';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../App';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', post: '', team: '' });
  const [roleKeys, setRoleKeys] = useState(new Set([]));
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const isAdmin = isAdminUser();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDelOpen,  onOpen: onDelOpen,  onClose: onDelClose  } = useDisclosure();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try { const r = await getAllUsers(); setUsers(r.data); } catch {}
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (user) => {
    setSelected(user);
    setForm({ name: user.name, username: user.username, email: user.email, post: user.post || '', team: user.team || '' });
    setRoleKeys(new Set([user.role?.name || user.role || 'ROLE_USER']));
    onEditOpen();
  };

  const handleUpdate = async () => {
    const role = [...roleKeys][0];
    if (!form.name || !form.username || !form.email || !role) { showToast('error', 'Required fields missing'); return; }
    const dup = users.some(u => u.id !== selected.id && (u.username === form.username || u.email === form.email));
    if (dup) { showToast('error', 'Username or email already in use'); return; }
    try {
      await updateUser(selected.id, { ...form, role });
      fetchUsers();
      onEditClose();
      showToast('success', 'User updated!');
    } catch {
      showToast('error', 'Failed to update user');
    }
  };

  const openDelete = (id) => { setDeleteId(id); onDelOpen(); };
  const handleDelete = async () => {
    try {
      await deleteUser(deleteId);
      fetchUsers();
      onDelClose();
      showToast('success', 'User deleted!');
    } catch {
      showToast('error', 'Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));
  const roleName = (u) => (u.role?.name || u.role || '').replace('ROLE_', '');

  const card = "border rounded-xl " + (theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500/30' : 'bg-white/80 border-slate-200 hover:border-blue-300 shadow-sm');
  const inputCls = { inputWrapper: theme === 'dark' ? 'border-white/20 bg-white/5' : '' };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users size={22} className="text-white" />
            </div>
            Users
          </h1>
          <p className={"text-sm mt-1 " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
            {users.length} member{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <NavLink to="/AddUser">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" startContent={<UserPlus size={16} />}>
              Add User
            </Button>
          </NavLink>
        )}
      </div>

      <Input placeholder="Search users…" value={search} onValueChange={setSearch}
        startContent={<Search size={16} className="text-slate-400" />}
        variant="bordered" classNames={inputCls} className="max-w-sm mb-6" />

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show">
        {filtered.map(user => (
          <motion.div key={user.id} variants={fadeUp} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className={card + " h-full"}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 w-full">
                  <Avatar
                    name={user.name}
                    size="md"
                    className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className={"text-xs truncate " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>@{user.username}</p>
                  </div>
                  <Chip size="sm" color={roleName(user) === 'ADMIN' ? 'warning' : 'primary'} variant="flat" startContent={<Shield size={10} />}>
                    {roleName(user)}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-1 space-y-1.5">
                <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <Mail size={13} className="shrink-0" /><span className="truncate">{user.email}</span>
                </div>
                {user.post && (
                  <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                    <Briefcase size={13} className="shrink-0" /><span className="truncate">{user.post}</span>
                  </div>
                )}
                {user.team && (
                  <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                    <Users size={13} className="shrink-0" /><span className="truncate">{user.team}</span>
                  </div>
                )}
                {isAdmin && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="flat" color="primary" startContent={<Edit size={13} />} onPress={() => openEdit(user)} className="flex-1">Edit</Button>
                    <Button size="sm" variant="flat" color="danger" startContent={<Trash2 size={13} />} onPress={() => openDelete(user.id)} className="flex-1">Delete</Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className={"text-center py-16 " + (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg">No users found</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} placement="center">
        <ModalContent className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody className="gap-3">
            <Input label="Name" value={form.name} onValueChange={set('name')} variant="bordered" classNames={inputCls} />
            <Input label="Username" value={form.username} onValueChange={set('username')} variant="bordered" classNames={inputCls} />
            <Input label="Email" type="email" value={form.email} onValueChange={set('email')} variant="bordered" classNames={inputCls} />
            <Input label="Post" value={form.post} onValueChange={set('post')} variant="bordered" classNames={inputCls} />
            <Input label="Team" value={form.team} onValueChange={set('team')} variant="bordered" classNames={inputCls} />
            <Select label="Role" selectedKeys={roleKeys} onSelectionChange={setRoleKeys} variant="bordered" classNames={inputCls}>
              <SelectItem key="ROLE_ADMIN">Admin</SelectItem>
              <SelectItem key="ROLE_USER">User</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>Cancel</Button>
            <Button color="primary" onPress={handleUpdate} startContent={<Edit size={15} />}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={isDelOpen} onClose={onDelClose} placement="center">
        <ModalContent className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDelClose}>Cancel</Button>
            <Button color="danger" onPress={handleDelete} startContent={<Trash2 size={15} />}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={"fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 font-medium "
              + (toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListUser;
