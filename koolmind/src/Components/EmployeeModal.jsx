import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react'
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
    Input
} from '@chakra-ui/react'

const EmployeeModal = ({id,handleMore,handleModal, change}) => {
   
    const toast = useToast()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [formData, setFormData] = useState({ 
        country: '',
        city: '',
        pincode: '',
        state: '' 
        });
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSave = () => {
            if(formData.city !== '')
            {
                axios.post(`https://fair-teal-peacock-wrap.cyclic.app/employees/employee-details/${id}`, formData)
                    .then(function (res) {
                        toast({
                            title: 'Address Added',
                            description: 'Employee Adrress has been added.',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        if (handleMore) {
                            handleMore(id);
                        }
                        
                    });
                    handleModal(!change)
                    
            onClose();
                }
                else{
                    toast({
                        title: 'Field Empty',
                        description: 'Please enter details first.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
        };
        const handleClose=()=>{
            handleModal(!change)
            onClose()
        }

    useEffect(() => {
        onOpen();
    });
  return (
    <div>
           <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader style={{ backgroundColor: 'purple', color: 'white' }}>
                       Add Employee Address
                    </ModalHeader>
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Country</FormLabel>
                            <Input ref={initialRef}
                                placeholder='Country'
                                name='country'
                                type='text'
                                value={formData.country}
                                onChange={handleChange} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>State</FormLabel>
                            <Input
                                placeholder='State'
                                type="text"
                                name='state'
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Pin Code</FormLabel>
                            <Input
                                placeholder='Pin Code'
                                type='number'
                                name='pincode'
                                value={formData.pincode}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>City</FormLabel>
                            <Input
                                placeholder='City'
                                type='text'
                                name='city'
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='purple' mr={3} onClick={handleSave} >
                       Save
                        </Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </div>
  )
}

export default EmployeeModal