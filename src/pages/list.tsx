import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import axiosClient from '../api';

interface Student {
    uid: string;
    first_name: string;
    last_name: string;
}

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const studentsJson = await AsyncStorage.getItem('students');
            if (studentsJson) {
                setStudents(JSON.parse(studentsJson));
            }
        } catch (error) {
            console.error('Error loading students:', error);
        }
    };

    const submitStudents = async () => {
        setIsSubmitting(true);
        for (const student of students) {
            try {
                const resp = await axiosClient.get(`pub/sit-in/quick-commit?uid=${student.uid} `)
                if (resp.status === 200 && resp.data.message === 'Success') {
                    const updatedStudents = students.filter((s) => s.uid !== student.uid);
                    await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
                }
            } catch (error) {

            }
        }
        setIsSubmitting(false);
    };

    const renderItem = ({ item }: { item: Student }) => (
        <View style={styles.item}>
            <Text>{item.first_name} . {item.last_name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={submitStudents}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? 'Submitting...' : 'Eject Students'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    AsyncStorage.setItem('students', JSON.stringify([]));
                    setStudents([]);
                }}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    Clear Students
                </Text>
            </TouchableOpacity>

            <FlatList
                data={students}
                renderItem={renderItem}
                keyExtractor={(item) => item.uid}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    AsyncStorage.setItem('students', JSON.stringify([]));
                    setStudents([]);
                }}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    Clear Students
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default StudentList;