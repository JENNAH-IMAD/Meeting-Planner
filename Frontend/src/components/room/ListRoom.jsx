import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button, Card, CardBody, CardHeader, Modal, ModalContent,
  ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, useDisclosure, Chip,
} from '@heroui/react';
import { DoorOpen, Search, Edit, Trash2, Users, Tag, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { getAllRooms, updateRoom, deleteRoom } from '../../services/RoomService';
import { isAdminUser } from '../../services/AuthService';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../App';

const ROOM_TYPES = ['Conference room', 'Boardroom', 'Meeting room', 'Training room', 'Presentation room'];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState(new Set([]));
  const [editCapacity, setEditCapacity] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const { theme } = useTheme();
  const isAdmin = isAdminUser();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDelOpen,  onOpen: onDelOpen,  onClose: onDelClose  } = useDisclosure();

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try { const r = await getAllRooms(); setRooms(r.data); } catch {}
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const openEdit = (room) => {
    setSelectedRoom(room);
    setEditName(room.name);
    setEditType(new Set([room.typeofRoom]));
    setEditCapacity(String(room.capacity));
    onEditOpen();
  };

  const handleUpdate = async () => {
    const typeofRoom = [...editType][0];
    if (!editName || !typeofRoom || !editCapacity) { showToast('error', 'All fields are required'); return; }
    const dup = rooms.some(r => r.id !== selectedRoom.id && r.name === editName && r.typeofRoom === typeofRoom);
    if (dup) { showToast('error', 'A room with the same name and type already exists'); return; }
    try {
      await updateRoom(selectedRoom.id, { name: editName, typeofRoom, capacity: parseInt(editCapacity) });
      fetchRooms();
      onEditClose();
      showToast('success', 'Room updated successfully!');
    } catch {
      showToast('error', 'Failed to update room');
    }
  };

  const openDelete = (id) => { setDeleteId(id); onDelOpen(); };

  const handleDelete = async () => {
    try {
      await deleteRoom(deleteId);
      fetchRooms();
      onDelClose();
      showToast('success', 'Room deleted successfully!');
    } catch {
      showToast('error', 'Failed to delete room');
    }
  };

  const filtered = rooms.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.typeofRoom?.toLowerCase().includes(search.toLowerCase())
  );

  const typeColor = { 'Conference room': 'primary', 'Boardroom': 'secondary', 'Meeting room': 'success', 'Training room': 'warning', 'Presentation room': 'danger' };

  const card = "border rounded-xl " + (theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500/30' : 'bg-white/80 border-slate-200 hover:border-blue-300 shadow-sm');
  const inputCls = { inputWrapper: theme === 'dark' ? 'border-white/20 bg-white/5' : '' };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <DoorOpen size={22} className="text-white" />
            </div>
            Meeting Rooms
          </h1>
          <p className={"text-sm mt-1 " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {isAdmin && (
          <NavLink to="/AddRoom">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white" startContent={<PlusCircle size={16} />}>
              Add Room
            </Button>
          </NavLink>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or type…"
        value={search}
        onValueChange={setSearch}
        startContent={<Search size={16} className="text-slate-400" />}
        variant="bordered"
        classNames={inputCls}
        className="max-w-sm mb-6"
      />

      {/* Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={stagger} initial="hidden" animate="show">
        {filtered.map(room => (
          <motion.div key={room.id} variants={fadeUp} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className={card + " h-full"}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between w-full">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <DoorOpen size={20} className="text-blue-400" />
                  </div>
                  <Chip size="sm" color={typeColor[room.typeofRoom] || 'default'} variant="flat">
                    {room.typeofRoom}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-1">
                <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
                <div className={"flex items-center gap-1.5 text-sm " + (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
                  <Users size={14} />
                  <span>Capacity: {room.capacity}</span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="flat" color="primary" startContent={<Edit size={13} />} onPress={() => openEdit(room)} className="flex-1">Edit</Button>
                    <Button size="sm" variant="flat" color="danger" startContent={<Trash2 size={13} />} onPress={() => openDelete(room.id)} className="flex-1">Delete</Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className={"text-center py-16 " + (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}>
          <DoorOpen size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg">No rooms found</p>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} placement="center">
        <ModalContent className={theme === 'dark' ? 'bg-slate-800 text-white' : ''}>
          <ModalHeader>Edit Room</ModalHeader>
          <ModalBody className="gap-4">
            <Input label="Room Name" value={editName} onValueChange={setEditName} variant="bordered" classNames={inputCls} />
            <Select label="Type of Room" selectedKeys={editType} onSelectionChange={setEditType} variant="bordered" classNames={inputCls}>
              {ROOM_TYPES.map(t => <SelectItem key={t}>{t}</SelectItem>)}
            </Select>
            <Input label="Capacity" type="number" value={editCapacity} onValueChange={setEditCapacity} variant="bordered" classNames={inputCls} />
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
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDelClose}>Cancel</Button>
            <Button color="danger" onPress={handleDelete} startContent={<Trash2 size={15} />}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Toast */}
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

export default ListRooms;
