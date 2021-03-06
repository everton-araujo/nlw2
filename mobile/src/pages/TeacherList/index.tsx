import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import api from '../../services/api';

import styles from './styles';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFilterVisible, setVisibleFilter] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const heartedTeachers = JSON.parse(response);
                const heartedTeachersId = heartedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(heartedTeachersId);
            }
        });
    }

    function handleToggleVisibleFilter() {
        setVisibleFilter(!isFilterVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites();

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setVisibleFilter(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title='Proffys disponíveis'
                headerRight={(
                    <BorderlessButton onPress={handleToggleVisibleFilter}>
                        <Feather name='filter' size={20} color='#FFF' />
                    </BorderlessButton>
                )}
            >
                {isFilterVisible && (<View style={styles.searchForm}>
                    <Text style={styles.label}>Matérias</Text>
                    <TextInput
                        style={styles.input}
                        value={subject}
                        onChangeText={text => setSubject(text)}
                        placeholder='Qual a matéria?'
                        placeholderTextColor='#c1bcc'
                    />

                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                                style={styles.input}
                                value={week_day}
                                onChangeText={text => setWeekDay(text)}
                                placeholder='Qual o dia?'
                                placeholderTextColor='#c1bcc'
                            />
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                                style={styles.input}
                                value={time}
                                onChangeText={text => setTime(text)}
                                placeholder='Qual o horário?'
                                placeholderTextColor='#c1bcc'
                            />
                        </View>
                    </View>

                    <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 8,
                }}
            >
                {/* {teachers.map(teacher => <TeacherItem />)} */}
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            hearted={favorites.includes(teacher.id)}
                        />
                    )
                })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;
