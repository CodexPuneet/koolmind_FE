import React, { useState, useEffect } from 'react';
import "./style.css";
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    FormControl,
    Button,
    FormLabel,
    Input,
    Center
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import EmployeeModal from './EmployeeModal';

const Dashboard = () => {
    const [employeeId, setEmployeeId] = useState(null);
    const [details, setDetails] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [data, setData] = useState([])
    const [user, setUser] = useState([])
    const [moreData, setMoreData] = useState({
        country: "India",
        state: "UP",
        city: "Noida",
        pincode: 110096,
    })
    const [list, setList] = useState(true)
    const [mode, setMode] = useState('add');
    const [formData, setFormData] = useState({
        name: '' ,
        email: '' ,
        phone: '',
        salary: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (mode === 'add') {
            if(formData.name !== '')
            {
            axios.post('https://fair-teal-peacock-wrap.cyclic.app/employees', formData)
                .then(function (res) {
                    onClose();
                    toast({
                        title: 'Employee Added',
                        description: 'New Employee has been added.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });

                    getData()
                    
                }) .catch(function (error) {
                    toast({
                        title: 'Field Empty',
                        description: 'Please enter all fields',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                  });
                
            }else{
                toast({
                    title: 'Field Empty',
                    description: 'Please enter details first.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
        else if (mode === 'edit' && employeeId) {
            
            axios.put(`https://fair-teal-peacock-wrap.cyclic.app/employees/${employeeId}`, formData)
                .then(function (res) {
                    toast({
                        title: 'Employee Edited',
                        description: 'The employee has been edited successfully.',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    });
                    getData()
                    onClose();
                });
        }
        
    };

    const getData = () => {
        axios.get('https://fair-teal-peacock-wrap.cyclic.app/employeeslist')
            .then(function (res) {
                setData(res.data)
            })
    }
    const handleDelete = (employeeId) => {
        axios.delete(`https://fair-teal-peacock-wrap.cyclic.app/employees/${employeeId}`)
            .then(function (res) {
                toast({
                    title: 'Employee Deleted',
                    description: 'The employee has been deleted successfully.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                getData()
            })
    };
    const handleEdit = (employeeId) => {
        setMode('edit');
        setEmployeeId(employeeId);
        axios.get(`https://fair-teal-peacock-wrap.cyclic.app/employees/${employeeId}`)
            .then(function (res) {
                setFormData(res.data);
            });
        onOpen();
    };
    const handleAdd = () => {
        setMode('add');
        onOpen();
    };

    const handleMore = (employeeId) => {
        axios.get(`https://fair-teal-peacock-wrap.cyclic.app/employees/${employeeId}`)
            .then(function (res) {
                setEmployeeId(employeeId);
                setUser(res.data.employee);
                setMoreData(res.data.employeeDetails)
                setList(false)
            });
    }
    const handleDash = () => {
        getData()
        setList(true);
      

    }
    const handleSalary = (employeeId) => {
        axios.put(`https://fair-teal-peacock-wrap.cyclic.app/employees/increase-salary/${employeeId}`)
            .then(function (res) {
                toast({
                    title: 'Congrats',
                    description: 'Please Check your Salary now.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setUser(res.data);
                setList(false)
            });
    }
    const handleModal =()=>{
        setDetails(!details)
    }

    useEffect(() => {
        getData()
    }, []);
   
    return (
        <div className="index">
            <div className="div">
                {
                    list ? <div>
                        <div className="text-wrapper">Employee List</div>
                        <div className="navbar">
                            <div className="text-wrapper-2">Name</div>
                            <div className="text-wrapper-3">Email</div>
                            <div className="text-wrapper-4">Phone</div>
                            <div className="text-wrapper-5">Salary</div>
                            <div className="text-wrapper-6">Employee Details</div>
                        </div>
                        <div className="th">
                            {data?.map((employee) => (
                                <div key={employee.id} className="div-2">
                                    <img
                                        className="profile"
                                        alt="Profile"
                                        src='https://freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png'
                                    />
                                    <div className="text-wrapper-7">{employee.name}</div>
                                    <div className="text-wrapper-8">{employee.email}</div>
                                    <div className="text-wrapper-9">{employee.phone}</div>
                                    <div className="text-wrapper-10">{employee.salary}</div>
                                    <button className="text-wrapper-11" onClick={() => handleMore(employee._id)}>See More</button>
                                    <button><img
                                        className="trash"
                                        alt="Trash"
                                        src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/trash-1.svg"
                                        onClick={() => handleDelete(employee._id)}
                                    /></button>
                                    <button><img
                                        className="pen"
                                        alt="Pen"
                                        src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/pen-1.svg"
                                        onClick={() => handleEdit(employee._id)}
                                    /></button>
                                </div>
                            ))}
                        </div>
                        <img
                            className="line"
                            alt="Line"
                            src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/line-2.svg"
                        />
                        <div className="btn" onClick={handleAdd}>
                            <div className="overlap">
                                <button className="text-wrapper-12">ADD NEW EMPLOYEE</button>
                            </div>
                        </div>
                        <img
                            className="sort"
                            alt="Sort"
                            src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/sort-1.svg"
                        />
                    </div> : <div>
                        <div className="text-wrapper">Employee Details</div>
                        <div className="th">
                            {data && (
                                <div key={user._id} className="div-3">
                                    <Center>
                                        <img
                                            className="profile_single"
                                            alt="Profile"
                                            src="https://freepngimg.com/thumb/facebook/62681-flat-icons-face-computer-design-avatar-icon.png"
                                        />
                                    </Center>
                                    <Center>
                                        <div className='employee'>Name : {user?.name}</div>
                                    </Center>
                                    <Center>

                                        <div className='employee'>Email : {user?.email}</div>
                                    </Center>
                                    <Center>

                                        <div className='employee'>Contact : {user?.phone}</div>
                                    </Center>
                                    <Center>

                                        <div className='employee'>Salary : {user?.salary}<b>Rs</b></div>
                                    </Center>

                                    {moreData !== null ?
                                        <Center>
                                            <div className='employee'>Country : {moreData?.country}</div>
                                            <div className='employee'>State : {moreData?.state}</div>
                                            <div className='employee'>City : {moreData?.city}</div>
                                            <div className='employee'>PinCode : {moreData?.pincode}</div>

                                        </Center> : <button className="address" onClick={handleModal}>Add Employee Address</button>}

                                 


                                </div>
                            )}
                        </div>

                        <img
                            className="line"
                            alt="Line"
                            src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/line-2.svg"
                        />
                        {data && <div key={user._id} className="btn" onClick={() => handleSalary(user._id)}>
                            <div className="overlap">
                                <button className="text-wrapper-12">INCREMENT SALARY</button>
                            </div>
                        </div>}

                        <img
                            className="sort"
                            alt="Sort"
                            src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/sort-1.svg"
                        />
                    </div>
                }

                <div className="sidebar">
                    <div className="navlinks">

                        <Center className="overlap-group">
                            {list ? <div>

                                <button className="text-wrapper-13">Homepage</button></div> : <div>

                                <button className="text-wrapper-13">{user?.name}</button></div>}

                        </Center>
                        {
                            !list && <button className="redirct" onClick={handleDash}>

                                Jump to Home
                            </button>
                        }

                    </div>
                    <div className="logo">
                        <div className="text-wrapper-20">KoolMind CRUD</div>
                        <img
                            className="img"
                            alt="Line"
                            src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/line-1.svg"
                        />
                    </div>
                    <img
                        className="profile-2"
                        alt="Profile"
                        src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
                    />
                </div>
                <header className="header">


                    <div className="search">
                        <div className="overlap-group-2">
                            <div className="text-wrapper-21">Search...</div>
                            <img
                                className="search-2"
                                alt="Search"
                                src="https://anima-uploads.s3.amazonaws.com/projects/64ba37388ed3d27d1a66710d/releases/64f381a5dc310b348588391b/img/search-1.svg"
                            />
                        </div>
                    </div>
                </header>
            </div>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader style={{ backgroundColor: 'purple', color: 'white' }}>
                        {mode === 'add' ? 'ADD NEW EMPLOYEE' : 'EDIT EMPLOYEE'}
                    </ModalHeader>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input ref={initialRef}
                                placeholder='Name'
                                name='name'
                                type='text'
                                value={formData.name}
                                onChange={handleChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                placeholder='Email'
                                type="email"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Phone</FormLabel>
                            <Input
                                placeholder='Phone'
                                type='number'
                                name='phone'
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Salary</FormLabel>
                            <Input
                                placeholder='Salary'
                                type='number'
                                name='salary'
                                value={formData.salary}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='purple' mr={3} onClick={handleSave}>
                            {mode === 'add' ? 'POST' : 'EDIT'}
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {details && <EmployeeModal id={employeeId} handleMore={handleMore} handleModal={setDetails} change={details} />}
                  
        </div>
    );
};

export default Dashboard;

