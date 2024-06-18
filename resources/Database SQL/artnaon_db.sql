-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: artnaon_db
-- ------------------------------------------------------
-- Server version	5.7.44-google-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `artnaon_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `artnaon_db` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `artnaon_db`;

--
-- Table structure for table `genre_desc`
--

DROP TABLE IF EXISTS `genre_desc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genre_desc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `genre` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre_desc`
--

LOCK TABLES `genre_desc` WRITE;
/*!40000 ALTER TABLE `genre_desc` DISABLE KEYS */;
INSERT INTO `genre_desc` VALUES (1,'Abstract','Abstract painting focuses on shapes, colors, forms, and gestural marks to convey artistic expression rather than realistic depictions. It can be completely non-representational or only loosely based on reality, allowing for a wide range of interpretations and emotional responses from the viewer. Notable abstract artists include Wassily Kandinsky, Piet Mondrian, and Jackson Pollock, each of whom contributed to the diverse techniques and styles within the movement.'),(2,'Expressionism','Expressionism is an early 20th-century movement focused on representing emotional experience rather than physical reality. It often employs distorted forms, exaggerated colors, and dynamic compositions to evoke feelings of angst and alienation. Notable artists include Edvard Munch and Ernst Ludwig Kirchner.'),(3,'Neoclassicism','Neoclassicism emerged in the mid-18th century, drawing inspiration from classical antiquity and emphasizing simplicity, symmetry, and rationality. It often features themes from ancient history and mythology, presenting idealized figures in calm, stoic poses. Jacques-Louis David and Jean-Auguste-Dominique Ingres are prominent figures in this movement.'),(4,'Primitivism','Primitivism is an early 20th-century art movement that draws inspiration from the art and culture of indigenous peoples and ancient civilizations. It features simplified forms, bold colors, and a sense of raw, untamed beauty. Artists like Paul Gauguin and Henri Rousseau are known for incorporating primitivist elements into their work.'),(5,'Realism','Realism emerged in the mid-19th century as a reaction against the idealization of subjects in Romanticism and Neoclassicism, focusing on depicting everyday life and ordinary people with truthful accuracy. It emphasizes detailed, unembellished representations and often addresses social issues. Gustave Courbet and Jean-François Millet are key figures in this movement.'),(6,'Romanticism','Romanticism, originating in the late 18th century, emphasizes emotion, individualism, and the sublime beauty of nature. It often features dramatic, dynamic compositions and explores themes of heroism, adventure, and the supernatural. Notable Romantic artists include Francisco Goya, J.M.W. Turner, and Caspar David Friedrich.'),(7,'Symbolism','Symbolism is a late 19th-century movement that focuses on representing ideas and emotions through symbolic images and metaphors rather than direct representation. It often features dreamlike, fantastical scenes and a focus on the inner world and spiritual experience. Prominent Symbolist artists include Gustave Moreau, Odilon Redon, and Edvard Munch.');
/*!40000 ALTER TABLE `genre_desc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre_desc_id`
--

DROP TABLE IF EXISTS `genre_desc_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genre_desc_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `genre` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre_desc_id`
--

LOCK TABLES `genre_desc_id` WRITE;
/*!40000 ALTER TABLE `genre_desc_id` DISABLE KEYS */;
INSERT INTO `genre_desc_id` VALUES (1,'Abstract','Lukisan abstrak menekankan bentuk, warna, dan garis tanpa representasi realistis, sering kali bersifat non-representasional atau hanya sedikit terkait dengan kenyataan. Tujuan utamanya adalah mengekspresikan emosi dan ide secara subjektif. Seniman terkenal termasuk Wassily Kandinsky, Piet Mondrian, dan Jackson Pollock.'),(2,'Expressionism','Ekspresionisme adalah gaya seni awal abad ke-20 yang berusaha menggambarkan pengalaman emosional daripada realitas fisik. Seniman menggunakan bentuk-bentuk yang terdistorsi dan warna-warna yang berlebihan untuk mengkomunikasikan perasaan keterasingan dan kecemasan. Seniman terkenal termasuk Edvard Munch dan Ernst Ludwig Kirchner.'),(3,'Neoclassicism','Neoklasikisme muncul pada pertengahan abad ke-18 dengan menghidupkan kembali seni dan budaya klasik Yunani dan Romawi. Lukisan-lukisannya menekankan kesederhanaan, simetri, dan idealisasi bentuk, sering kali dengan tema sejarah atau mitologi. Jacques-Louis David dan Jean-Auguste-Dominique Ingres adalah tokoh penting dalam gerakan ini.'),(4,'Primitivism','Primitivisme adalah gerakan seni awal abad ke-20 yang terinspirasi dari seni dan budaya masyarakat pribumi dan peradaban kuno. Lukisan-lukisannya menampilkan bentuk-bentuk yang disederhanakan dan warna-warna berani untuk menciptakan kesan keaslian dan kealamian. Paul Gauguin dan Henri Rousseau adalah seniman yang terkenal dengan gaya ini.'),(5,'Realism','Realisme muncul pada pertengahan abad ke-19 sebagai reaksi terhadap idealisasi subjek dalam Romantisisme dan Neoklasikisme, dengan fokus pada penggambaran kehidupan sehari-hari dan orang-orang biasa secara akurat. Gerakan ini menekankan representasi yang detail dan tidak diperindah, sering kali mengangkat isu-isu sosial. Gustave Courbet dan Jean-François Millet adalah tokoh utama dalam gerakan ini.'),(6,'Romanticism','Romantisisme, yang berasal dari akhir abad ke-18, menekankan emosi, individualisme, dan keindahan alam yang mengagumkan. Lukisan-lukisannya sering kali dramatis dan dinamis, mengeksplorasi tema kepahlawanan, petualangan, dan supernatural. Seniman terkenal termasuk Francisco Goya, J.M.W. Turner, dan Caspar David Friedrich.'),(7,'Symbolism','Simbolisme adalah gerakan akhir abad ke-19 yang fokus pada representasi ide dan emosi melalui gambar simbolik dan metaforis daripada representasi langsung. Lukisan-lukisannya sering menampilkan pemandangan yang seperti mimpi dan fantastis, dengan penekanan pada dunia batin dan pengalaman spiritual. Seniman simbolis terkenal termasuk Gustave Moreau, Odilon Redon, dan Edvard Munch.');
/*!40000 ALTER TABLE `genre_desc_id` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paintings`
--

DROP TABLE IF EXISTS `paintings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paintings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `description` text,
  `upload_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `paintings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paintings`
--

LOCK TABLES `paintings` WRITE;
/*!40000 ALTER TABLE `paintings` DISABLE KEYS */;
INSERT INTO `paintings` VALUES (31,4,'https://storage.googleapis.com/painting-bucket/f7b0645d-5ef0-4135-96bd-590e427d6438-Abstract_image_1188.jpg','Abstract','aku mah masih pemula','2024-06-14 15:33:34'),(32,4,'https://storage.googleapis.com/painting-bucket/0d4e052a-e83a-4318-a4cd-418f4ffe470f-9223372032559886687.jpg','Realism','ini siapa yahh','2024-06-14 15:38:58'),(38,13,'https://storage.googleapis.com/painting-bucket/ee06bb26-afbf-49a9-adfc-e80b3afa72c7-20240616_0030155336346277248857690.jpg','Abstract','ini adalah lukisan abstrak ','2024-06-15 17:31:48'),(42,34,'https://storage.googleapis.com/painting-bucket/16974abc-8e2a-4f39-bda6-fb2865623acb-20240617_1913008794117195574838428.jpg','Abstract','abstraaaaak','2024-06-17 12:13:02'),(45,37,'https://storage.googleapis.com/painting-bucket/24e6e126-3c53-4ba2-894b-f4db19ba1b47-20240618_1526592911047775134288823.jpg','Abstract','This painting is a prime example of abstract art by Wassily Kandinsky, a pioneer in this genre. Kandinsky is known for his use of bold colors, geometric shapes, and dynamic compositions, all of which are evident in this piece. The painting is filled with various geometric shapes such as circles, triangles, and lines that interact with each other in a complex and harmonious way, creating a sense of movement and rhythm. Kandinsky uses a vibrant palette of colors, with each color carefully chosen to evoke specific emotions, adding depth and energy to the composition. The dynamic lines and angles guide the viewer\'s eye across the canvas, contributing to the overall lively nature of the artwork. Unlike representational art, this painting does not depict any recognizable objects or scenes; instead, it focuses on the emotional and spiritual impact of the shapes and colors, allowing viewers to interpret it based on their personal feelings and perspectives. Wassily Kandinsky (1866-1944) was a Russian painter and art theorist, often credited as one of the founders of abstract art, who believed that art should go beyond mere representation and express the inner life of the artist. His work often reflects his interest in music, with compositions that resemble the flow and rhythm of musical pieces. In this painting, the geometric shapes and vibrant colors create a visual symphony, engaging the viewer in a unique and profound way.','2024-06-18 08:27:00'),(46,37,'https://storage.googleapis.com/painting-bucket/b9498b00-f26f-4c4d-8792-7d426464f584-20240618_1526596068612884417176259.jpg','Expressionism','\"The Scream\" is perhaps the most famous Expressionist painting by Edvard Munch. It depicts a figure standing on a bridge, clutching its face in a gesture of utter despair and anguish. The sky is painted in swirling, fiery hues of red, orange, and yellow, while the landscape below is rendered in dark, ominous tones. The figure\'s face is distorted into a primal scream, capturing a moment of intense emotional crisis. Munch described the inspiration for this painting as a moment when he felt a \"great, infinite scream pass through nature,\" reflecting his inner turmoil and anxiety.','2024-06-18 08:31:42'),(47,37,'https://storage.googleapis.com/painting-bucket/0280d81e-f6e2-432e-93a8-6de63b8600c3-20240618_152659278279271219517949.jpg','Neoclassicism','\"Oath of the Horatii\" is one of David\'s most famous paintings, depicting a scene from Roman legend where three brothers swear an oath to defend Rome against its enemies. The painting is characterized by its clear, structured composition, precise detail, and emphasis on the virtues of duty and sacrifice. The figures are idealized and posed in a way that reflects the classical principles of balance and harmony.','2024-06-18 08:36:50'),(48,37,'https://storage.googleapis.com/painting-bucket/a1ec9eae-8ee6-4480-ad6a-193e39688479-20240618_1526595383773683661619470.jpg','Primitivism','This painting by Gauguin is a monumental work that explores existential questions through a series of symbolic figures and scenes. The simplified forms, vivid colors, and symbolic content reflect Gauguin\'s Primitivist approach, drawing on his experiences in Tahiti and his desire to capture the spiritual essence of the island\'s culture.','2024-06-18 08:37:10'),(49,37,'https://storage.googleapis.com/painting-bucket/5913a131-0801-44c9-9b9b-1b8f5fd4b397-20240618_1526597054014370928563340.jpg','Realism','\"The Stone Breakers\" is one of Courbet\'s most famous works, depicting two laborers breaking stones by the roadside. The painting is characterized by its attention to detail, naturalism, and focus on the harsh realities of manual labor. Courbet\'s use of earthy tones and realistic depiction of the figures emphasizes the dignity and resilience of the working class.','2024-06-18 08:37:26'),(50,37,'https://storage.googleapis.com/painting-bucket/469123b9-85ad-4837-a33f-9498c6a74ae8-20240618_152659651370825606985925.jpg','Romanticism','\"Wanderer above the Sea of Fog\" is one of Friedrich\'s most iconic paintings, depicting a lone figure standing on a rocky outcrop, gazing out over a sea of fog. The composition and use of light and shadow create a sense of awe and contemplation, capturing the Romantic ideals of individualism and the sublime beauty of nature.','2024-06-18 08:37:43');
/*!40000 ALTER TABLE `paintings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_likes`
--

DROP TABLE IF EXISTS `user_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `painting_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `painting_id` (`painting_id`),
  CONSTRAINT `user_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_likes_ibfk_2` FOREIGN KEY (`painting_id`) REFERENCES `paintings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_likes`
--

LOCK TABLES `user_likes` WRITE;
/*!40000 ALTER TABLE `user_likes` DISABLE KEYS */;
INSERT INTO `user_likes` VALUES (2,8,32),(3,8,38),(4,13,38),(6,12,38),(7,31,38),(8,34,42),(9,37,32),(10,37,31),(11,37,45);
/*!40000 ALTER TABLE `user_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_pic_url` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'nodejs','nodejs@gmail.com','$2b$10$KBPHGBaXDS2oGM77EFdSWex7lIGcc8ljQbylQzer5d74L7GHHw21a','2024-06-08 19:33:06','https://storage.googleapis.com/profile_pic_88/nodejs.jpg'),(4,'zalfy77','zalfyputra@gmail.com','$2b$10$Z1mE5k4uUeYHb65f9xxse.d3rfwJLY2p4BkgQ91Rn4wjLyxxsuM2q','2024-06-08 19:48:57','https://storage.googleapis.com/artnaon_profile_picture/zalfy77-e5bd9bfe-86ba-4604-84c7-132988cceba6.jpg'),(5,'artnaon','artnaon@bangkit.academy','$2b$10$V.gwcLm3B77jyA67jI8v9.cfxQADJqWYgCD0j5xhJERWdFqGgtssS','2024-06-09 06:07:07',''),(6,'test','testing@gmail.com','$2b$10$FFLK0Otda6Z339auzkPzVO1RDtaK6dW8AYUunHSNsJJ481tvqV34.','2024-06-09 08:08:51',''),(7,'testing','test@gmail.com','$2b$10$FSX/oby/xrcJB0kcFK6B6u3qsl9ox575MVIhLGiKXC5hNpwsJOIUu','2024-06-09 08:25:43',''),(8,'0000bzy','bzy@gmail.com','$2b$10$zoCrj2A07wNZb/Lgj8vycu3tMfffQI6beFvEy6sryuFFJaRFHXq9m','2024-06-09 08:30:04','https://storage.googleapis.com/artnaon_profile_picture/0000bzy-d89f422f-56ba-489f-9691-b09bef23e229.jpg'),(9,'BZY','bzbzbz@gmail.com','$2b$10$HgHnM0DUVWWYYnSkaJp1a.k9nvOUcBPZ470T0S7xp7Sc5xDFZcJs6','2024-06-09 08:35:47',''),(10,'testing','testingz@gmail.com','$2b$10$FIMKpxeHaDX9753l6ixGK.JbQkwJO5i7ePiva6vKtr7z.o9ta/bTS','2024-06-09 09:01:50',''),(11,'testing','tessting@gmail.com','$2b$10$S2SXussuVRLFs9ruJ9wcQezwspreQaQDVNX5v8DtQr42oIke1rRz2','2024-06-10 04:01:49',''),(12,'azzar12','yuzzarmalik1@gmail.com','$2b$10$DsUN8bBQiSLARCoAs3AP1OBqy4SlJMk2sHze4jqkSnPMvUV3AGFGa','2024-06-10 05:21:07','https://storage.googleapis.com/artnaon_profile_picture/azzar-292e8015-a9e5-48f3-80d9-697f90293484.jpg'),(13,'TesTiNg','testing123@gmail.com','$2b$10$gjswR2Gsra0MY/Fl9THPgexTX9lSDk5wfgv/eunHtLQIu2j6toeeC','2024-06-12 14:17:11','https://storage.googleapis.com/artnaon_profile_picture/TesTiNg-067fa51a-9042-4808-9fe4-e5008b9d3ab7.jpg'),(14,'postman','postman@gmail.com','$2b$10$vLbt1aamhVYKI3Y3w88hg.Q829qd4TMyZl4io4dZgTzwscNBOPKJ.','2024-06-13 06:23:48',''),(15,'android','android@gmail.com','$2b$10$Ovhv8moRBhOKLNzC5H4W1evaQ3ILYk4ciz5WirW6J2uweuLu86yke','2024-06-13 06:53:42',''),(16,'testing1234','testing1234@gmail.com','$2b$10$iEnP5Z07tZtHw2VOyoLVzO28vLUB2pM3TypyLKIjoOVYde78plehO','2024-06-13 07:20:36',''),(17,'testtt1','test12345678@gmail.com','$2b$10$afFHaNCZi8MHQ4.ilOsbouSG09uf2.zkKRlYxpclHQ2ykOx7sp/Sy','2024-06-13 08:03:22',''),(18,'test123','test123@gmail.com','$2b$10$LgTRWelI83ehf70TerhZgO4WSOoUgUwfZc6ldxhmWCZlcxxH6lr1y','2024-06-13 09:17:51',''),(19,'azzar','azzarmalik1@gmail.com','$2b$10$QspnsxT93FHvhvWxxrYxlO49zI/0A6yWxgns4ZQ.EYiz/vBPLKXIG','2024-06-13 09:32:11',''),(20,'test1234','test1234@gmail.com','$2b$10$fP63NwpofFWc9fMoc8DWYuLIEf5GpMGpEbz2lBAX.v5GzwdzXEbPW','2024-06-13 10:26:41',''),(21,'wulan','wulanazzahra@gmail.com','$2b$10$qIrUQdXJcieQSLrGb6wfNOsyu5k8jvtaWMFvNttKMH3CmTzZFH9Xi','2024-06-13 18:24:45',''),(22,'raihan','raihan12@gmai.com','$2b$10$Ui43gZImTIabk3o2HH8I0e.aDn.twDW7V8f1ReRlNIoDdtCnhE0wW','2024-06-13 18:35:12',''),(23,'raihan','raihan12@gmail.com','$2b$10$jTWtTG2xGr3ITLgCco3TnOdvts8kQSXuVE/dZBve1beb7Kg3qOMQm','2024-06-13 18:35:33',''),(24,'gagak','rendi12@gmail.com','$2b$10$6uENybbYZigr3xWzkkp5N.j9QDF7Qf7BYJWUKXUk.sM0w6wOkql4e','2024-06-13 19:09:18',''),(25,'yuzzar','yuzzargans@gmail.com','$2b$10$6uNWpPoqJ4RHf8C.xilZ5u/ZHByX.aJRCr2JhDvxJP9EUDMKMWvL.','2024-06-15 16:17:11','https://storage.googleapis.com/artnaon_profile_picture/yuzzar-00874272-aa52-4942-a347-7bd438f0af1c.jpg'),(26,'ibaayyy','ibay@gmail.com','$2b$10$/AjmBSbbQx3Eugs465EOJOnYNgoFoS4RT4HxyV6WO.x6/SdTMYodi','2024-06-16 09:44:36',''),(27,'artnaon123','artnaon123@gmail.com','$2b$10$T4.1uOYMk.RoT5yOcT0LLuj8T7PsZNy8YcMmkFTII8RQNgZcgCObO','2024-06-16 16:01:00',''),(28,'fimel_','shfra.fimelita26@gmail.com','$2b$10$4ErRKZNkItqHo.RpbuYXdOWrzJfE93BGst7oGVb5vIAX4LlqpR83K','2024-06-16 17:00:39','https://storage.googleapis.com/artnaon_profile_picture/fimel_-edca356a-0cc7-4fdf-9e48-77f8549fd2bf.jpg'),(29,'Sul245','sulsyd2453','$2b$10$a6EksMTGKDGg5T0MAGe5fe0lwF9atq5SwFzMQQ3oYzZVLoEYG2OTK','2024-06-16 17:03:26',''),(30,'Sul245','sul2453@gmail.com','$2b$10$VltTOh5aBydJfVMsPWhTn.2C4/ERO8JxviWbiDHEbVpiD0tIz0rDK','2024-06-16 17:03:41',''),(31,'RizalNR','rizalnaufal0309@gmail.com','$2b$10$m1Rp/s0tVMTfjEjFJgv0DuyW7nmJDUHAHsaTeXI.qNDRuwPYeatMa','2024-06-16 17:13:07',''),(32,'nenda','wulannz.ahra@gmail.com','$2b$10$fJPzUxs9GpeKJTzEUiuSCe5ExT.4H7whwfCSm1e7iB2BDvc1cUDmS','2024-06-16 17:54:44',''),(33,'mlvmalvinn','malvinherdyanto@gmail.com','$2b$10$LAndfLW7DfS/7RZA8l/ebOChi7WXqjjFv5uQCcfzTNo4mDgONlFmy','2024-06-16 22:24:26',''),(34,'biziya123','bzy2@gmail.com','$2b$10$yL5TSSfa0PFc5QQep9u4e.B.OpFnY3ReBiJnqxRdBS7fRnbMyiWRG','2024-06-17 11:15:43','https://storage.googleapis.com/artnaon_profile_picture/biziya123-e5af9ff2-f951-413b-8f5e-ab12d6349f37.jpg'),(35,'azzar','yuzzarmalik12@gmail.com','$2b$10$uxQiRYOwvZMpY8Ukj/V6jOx0mtd5RwFZ9Rg7khr8KA6eq3XBXdQBG','2024-06-17 22:23:23',''),(36,'azzaryu','testyuzzar@gmail.com','$2b$10$HUalPb3gtPGaCccKinBXx.9KE0k87HWQcVod4NMZWjWhIiavUBK66','2024-06-17 22:24:54',''),(37,'ArtNaon','artnaon@gmail.com','$2b$10$HcbaDgj7z/pf1HqGu70WiesNBiAr4IvLYLAqhDVro8IwJY1ikBU3.','2024-06-18 08:13:57','https://storage.googleapis.com/artnaon_profile_picture/ArtNaon-9b93e9ff-e0e7-4d8f-9ca2-8b15ef9e0518.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-18 14:09:13
