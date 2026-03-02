import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button, Card, CardBody, CardHeader, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem,
  useDisclosure, Chip, Textarea,
} from '@heroui/react';
import { BookOpen, Search, Edit, Trash2, Calendar, Clock, User, DoorOpen, AlignLeft, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { getAllReservations, updateReservation, deleteReservation } from '../../services/Reservation';
import { getAllRooms } from '../../services/RoomService';
import { getAllUsers } from '../../services/UserService';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../App';
import { format, parseISO, isAfter } from 'date-fns';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const ListReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', dateMeeting: '', timeMeetingStart: '', timeMeetingEnd: '', room: '', createdBy: '', description: '' });
  const [roomKeys, setRoomKeys] = useState(new Set([]));
  const [userKeys, setUserKeys] = useState(new Set([]));
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDelOpen,  onOpen: onDelOpen,  onClose: onDelClose  } = useDisclosure();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [r, rm, us] = await Promise.all([getAllReservations(), getAllRooms(), getAllUsers()]);
      setReservations(r.data);
      setRooms(rm.data);
      setUsers(us.data);
    } catch {}
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (res) => {
    setSelected(res);
    setForm({
      title: res.title, dateMeeting: res.dateMeeting, timeMeetingStart: res.timeMeetingStart,
      timeMeetingEnd: res.timeMeetingEnd, room: res.room, createdBy: res.createdBy, description: res.description,
    });
    setRoomKeys(new Set([res.room]));
    setUserKeys(new Set([res.createdBy]));
    onEditOpen();
  };

  const handleUpdate = async () => {
    const room = [...roomKeys][0];
    const createdBy = [...userKeys][0];
    if (!form.title || !form.dateMeeting || !form.timeMeetingStart || !form.timeMeetingEnd || !room || !createdBy || !form.description) {
      showToast('error', 'All fields are required');
      return;
    }
    try {
      await updateReservation(selected.id, { ...form, room, createdBy });
      fetchAll();
      onEditClose();
      showToast('success', 'Reservation updated!');
    } catch {
      showToast('error', 'Failed to update reservation');
    }
  };

  const openDelete = (id) => { setDeleteId(id); onDelOpen(); };
  const handleDelete = async () => {
    try {
      await deleteReservation(deleteId);
      fetchAll();
      onDelClose();
      showToast('success', 'Reservation deleted!');
    } catch {
      showToast('error', 'Failed to delete reservation');
    }
  };

  const filtered = reservations.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.room?.toLowerCase().includes(search.toLowerCase()) ||
    r.createdBy?.toLowerCase().includes(search.toLowerCase())
  );

  const isUpcoming = (dateStr) => {
    try { return isAfter(parseISO(dateStr), new Date()); } catch { return false; }
  };

  const card = "border rounded-xl " + (theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500/30' : 'bg-white/80 border-slate-200 hover:border-blue-300 shadow-sm');
  const inputCls = { inputWrapper: theme === 'dark' ? 'border-white/20 bg-white/5' : '' };

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BookOpen size={22} className="text-white" />
            </div>
            Reservations
          </h1>
          <p className={"text-sm mt-1 " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
            {reservations.length} reservation{reservations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NavLink to="/AddReservation">
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" startContent={<PlusCircle size={16} />}>
            New Booking
          </Button>
        </NavLink>
      </div>

      <Input placeholder="Search reservations…" value={search} onValueChange={setSearch}
        startContent={<Search size={16} className="text-slate-400" />}
        variant="bordered" classNames={inputCls} className="max-w-sm mb-6" />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={stagger} initial="hidden" animate="show">
        {filtered.map(res => (
          <motion.div key={res.id} variants={fadeUp} whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className={card + " h-full"}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between w-full">
                  <h3 className="font-semibold text-lg leading-tight flex-1 pr-2">{res.title}</h3>
                  <Chip size="sm" color={isUpcoming(res.dateMeeting) ? 'success' : 'default'} variant="flat">
                    {isUpcoming(res.dateMeeting) ? 'Upcoming' : 'Past'}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-1 space-y-2">
                <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <Calendar size={13} className="shrink-0" />
                  <span>{res.dateMeeting}</span>
                </div>
                <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <Clock size={13} className="shrink-0" />
                  <span>{res.timeMeetingStart} – {res.timeMeetingEnd}</span>
                </div>
                <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <DoorOpen size={13} className="shrink-0" />
                  <span className="truncate">{res.room}</span>
                </div>
                <div className={"flex items-center gap-2 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <User size={13} className="shrink-0" />
                  <span>{res.createdBy}</span>
                </div>
                {res.description && (
                  <div className={"flex items-start gap-2 text-sm " + (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
                    <AlignLeft size={13} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{res.description}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="flat" color="primary" startContent={<Edit size={13} />} onPress={() => openEdit(res)} className="flex-1">Edit</Button>
                  <Button size="sm" variant="flat" color="danger" startContent={<Trash2 size={13} />} onPress={() => openDelete(res.id)} className="flex-1">Delete</Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className={"text-center py-16 " + (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
          <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg">No reservations found</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl" placement="center" scrollBehavior="inside">
        <ModalContent className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
          <ModalHeader>Edit Reservation</ModalHeader>
          <ModalBody className="gap-4">
            <Input label="Title" value={form.title} onValueChange={set('title')} variant="bordered" classNames={inputCls} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Date" type="date" value={form.dateMeeting} onValueChange={set('dateMeeting')} variant="bordered" classNames={inputCls} />
              <Input label="Start Time" type="time" value={form.timeMeetingStart} onValueChange={set('timeMeetingStart')} variant="bordered" classNames={inputCls} />
              <Input label="End Time" type="time" value={form.timeMeetingEnd} onValueChange={set('timeMeetingEnd')} variant="bordered" classNames={inputCls} />
            </div>
            <Select label="Room" selectedKeys={roomKeys} onSelectionChange={setRoomKeys} variant="bordered" classNames={inputCls}>
              {rooms.map(r => <SelectItem key={r.name + ' - ' + r.typeofRoom}>{r.name + ' - ' + r.typeofRoom}</SelectItem>)}
            </Select>
            <Select label="Created By" selectedKeys={userKeys} onSelectionChange={setUserKeys} variant="bordered" classNames={inputCls}>
              {users.map(u => <SelectItem key={u.name}>{u.name}</SelectItem>)}
            </Select>
            <Textarea label="Description" value={form.description} onValueChange={set('description')} variant="bordered" classNames={inputCls} minRows={3} />
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
              Are you sure you want to delete this reservation?
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

export default ListReservation;
