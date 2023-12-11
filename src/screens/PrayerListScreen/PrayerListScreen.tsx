import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AppButton from '../../components/AppButton'
import Seperator from '../../components/Seperator'
import { openBrowserAsync } from 'expo-web-browser'
import * as DocumentPicker from 'expo-document-picker'
import AWS from 'aws-sdk'

const PrayerListScreen = () => {
  const [selectedFile, setSelectedFile]           = useState()
  const [showUploadSuccess, setShowUploadSuccess] = useState(false) 
  const [showUploadError, setShowUploadError]     = useState(false)
  const [s3BucketName, setS3BucketName]           = useState("")
  const [region, setRegion]                       = useState("")
  const [accessKeyId, setAccessKeyId]             = useState("")
  const [secretAccessKey, setSecretAccessKey]     = useState("")
  const [location, setLocation]                   = useState({lat: '35.962639', long: '-83.916718'})
  const [loading, setLoading]                     = useState(true)

  useEffect(() => {
    axios.get(`https://pastor4life.click/p4l/settings`)
    .then(res => {
      console.log("fetchSettings: ", res)
        setS3BucketName(res.data.s3Bucket)
        setRegion(res.data.region)
        setAccessKeyId(res.data.accessKeyId)
        setSecretAccessKey(res.data.secretAccessKey)
        setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      // console.warn(s3BucketName, region, accessKeyId, secretAccessKey)
    }
  }, [loading])

  const pickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      })
      setSelectedFile(file)
    } catch (error) {
      console.warn("Upload settings error", error)
    }
  }

  const uploadFile = () => {
    AWS.config.update({
      accessKeyId:     accessKeyId,
      secretAccessKey: secretAccessKey
    })

    const myBucket = new AWS.S3({
        params: { Bucket: s3BucketName},
        region: region,
    })

    let emailId = "isaac.tullos@gmail.com"
    // let emailId = props.userId.replace("@", "-d")
    // let fileName = `t${location.lat}${location.long}-u${emailId}.pdf`
    let fileName = `t${location.lat}${location.long}-u${emailId}.pdf`

    const params = {
      ACL: 'public-read',
      Body: JSON.stringify(selectedFile),
      Bucket: s3BucketName,
      Key: fileName.replace(/['"]+/g, '')
      // Key: file.name
    }

    console.warn("params: ", params)

    myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => {
      setShowUploadSuccess(true)
    })
    .send((err) => {
      if (err) {
        console.log(err)
        setShowUploadError(true)
      }
    })
  }

  useEffect(() => {
    if (!selectedFile) return 
    console.warn("file data: ", selectedFile["assets"][0])
  
  }, [selectedFile])
  
  
  
  
  return (
    <ScrollView>
    <View style={styles.container}>
      
      <View style={{marginTop:30}}></View>
      <Text style={styles.title}>
        Step 1:
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', margin: 20, width: '100%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      <View style={{marginTop:10}}></View>
      <View style={styles.textBox}>
        <Text style={styles.text}>
          Download your local
        </Text>
        <Text style={styles.text}>
          prayer list from
        </Text>
        <TouchableOpacity onPress={() => openBrowserAsync("https://blesseveryhome.com/")}>
            <Text style={styles.link}>
              Bless Every Home
            </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop:25}}></View>
      <View style={{flexDirection: 'row', alignItems: 'center', margin: 20, width: '100%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      
      <Text style={styles.title}>
        Step 2:
      </Text>

      <View style={{flexDirection: 'row', alignItems: 'center', margin: 20, width: '100%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>
          Upload your
        </Text>
        <Text style={styles.text}>
          prayer list here:
        </Text>
      </View>
      <View style={{marginTop:25}}></View>
      <AppButton 
        text="Choose File"
        type='NAVY'
        onPress={pickFile}
      />
      { (selectedFile) ? (
        <>
          <Text style={styles.fileTitle}>File:</Text>
          <Text style={styles.file}>{selectedFile["assets"][0]["name"]}</Text>
          <View style={{marginTop:20}}></View>
          <AppButton 
            text="Upload File"
            type='GREEN'
            onPress={uploadFile}
          />
        </>
      ) : null }
      <View style={{flexDirection: 'row', alignItems: 'center', margin: 20, width: '100%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      <Text style={styles.title}>
        Step 3:
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', margin: 20, width: '100%'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'grey'}} />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.text}>
          Pray for people
        </Text>
        <Text style={styles.text}>
          in your community
        </Text>
      </View>
      <View style={{marginTop:40}}></View>
    </View>
    </ScrollView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 4,
    // borderColor: 'red',
  },
  textBox: {
    flex: .3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    
  },
  title: {
    fontSize: 30,
  },
  fileTitle: {
    fontSize: 24,
    margin: 10,
  },
  file: {
    fontSize: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 40,
  },
  link: {
    fontSize: 24,
    marginTop: 11,
    color: "blue",
  }
})

export default PrayerListScreen