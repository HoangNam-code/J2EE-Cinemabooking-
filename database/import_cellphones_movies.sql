-- ========================================================
-- CELLPHONES SFORUM MOVIE DATA IMPORT FOR CINEPRIME
-- Total movies extracted: 85
-- Database: cinemabooking (XAMPP MySQL)
-- ========================================================

USE `cinemabooking`;

SET FOREIGN_KEY_CHECKS = 0;

-- Thêm các danh mục thể loại phong phú
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (1, 'Hành động', 'Thể loại phim hành động') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (2, 'Khoa học viễn tưởng', 'Thể loại phim khoa học viễn tưởng') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (3, 'Tình cảm', 'Thể loại phim tình cảm') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (4, 'Kinh dị', 'Thể loại phim kinh dị') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (5, 'Hoạt hình', 'Thể loại phim hoạt hình') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (6, 'Hài', 'Thể loại phim hài') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (7, 'Phiêu lưu', 'Thể loại phim phiêu lưu') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (8, 'Tâm lý', 'Thể loại phim tâm lý') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (9, 'Giật gân', 'Thể loại phim giật gân') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (10, 'Võ thuật', 'Thể loại phim võ thuật') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (11, 'Âm nhạc', 'Thể loại phim âm nhạc') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (12, 'Gia đình', 'Thể loại phim gia đình') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (13, 'Tâm linh', 'Thể loại phim tâm linh') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);
INSERT INTO `categories` (`CategoryID`, `CategoryName`, `Description`) VALUES (14, 'Anime', 'Thể loại phim anime') ON DUPLICATE KEY UPDATE `CategoryName` = VALUES(`CategoryName`);


-- Chèn danh sách phim từ CellphoneS Sforum
INSERT INTO `movies` (`MovieID`, `MovieName`, `Duration`, `Director`, `Actors`, `Description`, `ReleaseDate`, `EndDate`, `PosterURL`, `TrailerURL`, `Status`) VALUES
(10, 'Doraemon: Nobita và Lâu Đài Dưới Đáy Biển (Phiên bản mới)', 102, 'Tetsuo Yajima', 'Mizuta Wasabi, Ohara Megumi, Kakazu Yumi, Kimura Subaru', 'Dự án làm lại từ tác phẩm kinh điển mang đến một hành trình khám phá đại dương sâu thẳm đầy kỳ thú của nhóm bạn quen thuộc. Trải nghiệm xem phim chiếu rạp hay này sẽ đưa khán giả chìm đắm vào thế giới dưới nước kỳ vĩ, nơi ẩn chứa những bí mật cổ xưa.', '2026-05-22', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(11, 'Tạm biệt Gohan', 140, 'Chayanop Boonprakob, Baz Poonpiriya, Atta Hemwadee', 'Yasushi Kitajima, Poe Mamhe Thar, Jinjett Wattanasin, Tontawan Tantivejakul', 'Bộ phim là một câu chuyện vô cùng cảm động và lấy đi nhiều nước mắt về lòng trung thành của chú chó mang tên Gohan đối với người chủ của mình. Tác phẩm thuộc phim chiếu rạp mới này khắc họa sâu sắc tình bạn thiêng liêng, những buồn vui trong cuộc sống thường nhật.', '2026-05-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(12, 'Ma Da Hàn Quốc: Hồ Nuốt Người', 96, 'Lee Sang-min', 'Kim Hye Yoon, Lee Jong-won, Jang Da Ah', 'Đoàn làm phim chạm trán thực thể tà ác dưới hồ Salmokj. Sự kết hợp giữa yếu tố tâm linh truyền thống và nhịp phim căng thẳng dồn dập sẽ khiến những khán giả yêu thích cảm giác mạnh phải liên tục rùng mình sợ hãi.', '2026-05-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(13, 'Mortal Kombat: Cuộc Chiến Sinh Tử 2', 116, 'Simon McQuoid', 'Lewis Tan, Jessica McNamee, Karl Urban, Hiroyuki Sanada', 'Tác phẩm thuộc danh sách phim chiếu rạp sắp ra mắt này là cuộc chiến của các nhà vô địch MMA bảo vệ Earthrealm khỏi thế lực của Shao Kahn, có sự xuất hiện nổi bật của nhân vật Johnny Cage.', '2026-05-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(14, 'Phí Phông: Quỷ Máu Rừng Thiêng', 120, 'Đỗ Quốc Trung', 'Kiều Minh Tuấn, Diệp Bảo Ngọc, Nina Nutthacha, Đoàn Minh Anh, NSƯT Hạnh Thúy', 'Câu chuyện kinh dị rùng rợn này khai thác sâu vào truyền thuyết dân gian Đông Nam Á về loài quỷ hút máu ban đêm. Khi một đoàn nghiên cứu trẻ tuổi vô tình đi sâu vào khu rừng cấm, họ đã trở thành mục tiêu săn đuổi của một thực thể khát máu tàn bạo ẩn mình dưới lốt người.', '2026-04-24', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(15, 'Mother Mary: Hào Quang Đơn Độc', 112, 'David Lowery', 'Anne Hathaway, Michaela Coel, Hunter Schafer', 'Tác phẩm điện ảnh nghệ thuật này theo chân hành trình đầy thăng trầm và góc khuất của một ngôi sao nhạc Pop. Bộ phim chiếu rạp này không chỉ phơi bày ánh hào quang rực rỡ trên sân khấu mà còn đi sâu vào sự cô độc tận cùng những áp lực khủng khiếp của danh vọng.', '2026-05-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(16, 'Làng Quỷ Quái', 99, 'Poj Arnon', 'Padung Songsang, Kapol Thongplub, Nicky Na Chat Juntapun', 'Tác phẩm kinh dị đậm chất văn hóa dân gian này kể về một ngôi làng bị cô lập hoàn toàn trên đỉnh núi cao quanh năm sương mù bao phủ. Đây là một đại diện nổi bật của dòng phim chiếu rạp được đầu tư kỹ lưỡng về mặt bối cảnh, âm thanh và tạo hình nhân vật nhằm mang lại nỗi sợ hãi.', '2026-05-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(17, 'Mobile Suit Gundam: Tia Chớp Hathaway', 95, 'Shukou Murase', 'Kensho Ono, Reina Ueda, Junichi Suwabe', 'Phần tiếp theo của biên niên sử vũ trụ Gundam mang đến những cuộc đối đầu nghẹt thở giữa các tổ chức chính trị và lực lượng nổi dậy. Sự xuất hiện của phim chiếu rạp này sẽ làm thỏa lòng người hâm mộ bằng những trận chiến
robot
khổng lồ được thiết kế tinh xảo và vô cùng đẹp mắt.', '2026-05-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-8.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(18, 'Heo Năm Móng', 103, 'Lưu Thành Luân', 'Võ Tấn Phát, Trần Ngọc Vàng, NSƯT Ốc Thanh Vân, Nghệ sĩ Thanh Thủy', 'Bộ phim chiếu rạp này xoay quanh một nhà sáng tạo nội dung tâm linh liều lĩnh khám phá miếu Ông Tà và đánh thức bí mật kinh hoàng về Cô Năm Hợi. Những bài học về luật nhân quả, lòng tham vô độ của con người được thể hiện qua các tình tiết giật gân.', '2026-04-24', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-9.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(19, 'Thẩm Mỹ Viện Âm Phủ', 100, 'Nguyễn Hữu Hoàng', 'Ngọc Trinh, Xuân Lan, Lê Xuân Tiền, Rima Thanh Vy, Phương Linh', 'Bộ phim chiếu rạp gần đây được nhiều khán giả quan tâm là Thẩm Mỹ Viện Âm Phủ. Câu chuyện kinh dị tăm tối này xoay quanh nhân vật Thanh, một cô gái trẻ vì quá mù quáng tìm cách cứu sống người yêu đang chìm trong cơn hôn mê sâu mà chấp nhận làm việc tại một viện thẩm mỹ hẻo lánh, đầy bí ẩn.', '2026-05-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-10.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(20, 'Lúc Đó Tôi Đã Chuyển Sinh Thành Slime: Nước Mắt Đại Dương', 105, 'Yasuhito Kikuchi', 'Miho Okasaki, Tomoaki Maeno, Yumiri Hanamori', 'Bộ phim chiếu rạp này xoay quanh chuyến nghỉ dưỡng của Rimuru tại đế chế Sarion và sự xuất hiện của nhân vật bí ẩn Yura. Kỹ xảo hình ảnh lung linh kết hợp cùng những trận chiến phép thuật đỉnh cao sẽ mang đến một bữa tiệc thị giác tuyệt vời cho mọi đối tượng khán giả. Phim sở hữu cốt truyện nguyên tác hoàn toàn mới, đóng vai trò là phần ngoại truyện cầu nối giữa phần 3 và phần 4 của series truyền hình.', '2026-05-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-11.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(21, 'Phi Vụ Thanh Toán Hào Môn', 105, 'John Patton Ford', 'Glen Powell, Margaret Qualley', 'Đại diện thuộc dòng phim chiếu rạp này cuốn hút người xem bằng những pha rượt đuổi nghẹt thở, những màn đấu trí đỉnh cao và các âm mưu lật đổ không thể lường trước. Đây là tựa phim chiếu rạp hay hứa hẹn sẽ tiếp tục xô đổ những kỷ lục doanh thu nhờ kịch bản thông minh và diễn xuất xuất sắc của dàn sao.', '2026-05-01', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-12.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(22, 'Hẹn Em Ngày Nhật Thực', 118, 'Lê Thiện Viễn', 'Khương Lê, Đoàn Thiên Ân, NSND Lê Khanh', 'Bộ phim chiếu rạp Việt Nam này dẫn dắt người xem qua những khung hình đẹp như tranh vẽ cùng câu chuyện tình yêu vượt qua mọi ranh giới định mệnh của hai người trẻ tuổi. Sự kết hợp hoàn hảo giữa âm nhạc da diết và cốt truyện giàu chất thơ chắc chắn sẽ lấy đi rất nhiều nước mắt của những tâm hồn mơ mộng.', '2026-04-03', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-13.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(23, 'Thoát Khỏi Tận Thế', 156, 'Phil Lord và Christopher Miller', 'Ryan Gosling, Sandra Hüller', 'Siêu phẩm điện ảnh giả tưởng tái hiện cuộc chiến sinh tồn khi Mặt Trời bị một sinh vật ngoài hành tinh hút cạn năng lượng, đẩy Trái Đất vào nguy cơ diệt vong. Tác phẩm thuộc phim chiếu rạp mới này là hành trình của người sống sót duy nhất tìm cách cứu Mặt Trời khỏi sinh vật ngoài hành tinh.', '2026-03-20', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-14.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(24, 'Ốc Mượn Hồn', 103, 'Đinh Tuấn Vũ', 'Quốc Trường, Tiểu Vy, Anh Phạm, Yên Đan', 'Lấy cảm hứng từ những câu chuyện tâm linh truyền miệng về việc chiếm đoạt thân xác người sống của các vong hồn vất vưởng. Bộ phim chiếu rạp gần đây này xoay quanh người đàn ông tên Quân mất vợ, tin rằng linh hồn vợ nhập vào cô gái khác.', '2026-06-05', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-15.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(25, 'Minions Và Quái Vật', 92, 'Pierre Coffin', 'Pierre Coffin, Jesse Eisenberg, Jeff Bridges', 'Những sinh vật màu vàng đáng yêu và tinh nghịch đã chính thức quay trở lại màn ảnh rộng trong một cuộc phiêu lưu hoàn toàn mới, hứa hẹn mang đến sự bùng nổ hài hước. Bộ phim chiếu rạp vui nhộn này kể về màn kết hợp bất đắc dĩ nhưng vô cùng thú vị giữa binh đoàn Minions ồn ào và một sinh vật huyền thoại khổng lồ.', '2026-07-01', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-16.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(26, 'Avengers: Doomsday', 155, 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Tom Holland, Benedict Cumberbatch, Chris Hemsworth', 'Trận chiến vĩ đại nhất kỷ nguyên đa vũ trụ chính thức mở ra khi các siêu anh hùng phải đối đầu với thực thể Doctor Doom tàn bạo. Siêu bom tấn phim chiếu rạp này quy tụ hàng trăm nhân vật được yêu thích từ khắp nơi trong dòng thời gian nhằm ngăn chặn sự sụp đổ hoàn toàn của toàn bộ thực tại. Với kinh phí đầu tư đạt mức kỷ lục và những pha hành động kỹ xảo hoành tráng chưa từng có, bộ phim chắc chắn sẽ xác lập nên những cột mốc doanh thu lịch sử mới.', '2026-12-18', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-17.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'COMING_SOON'),
(27, 'Mưa đỏ', 110, 'Đặng Thái Huyền', 'Đỗ Nhật Hoàng, Lâm Thanh Nhã, Phương Nam, Đình Khang', 'Phim cách mạng chiếu vào dịp lễ 2/9', '2025-08-22', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(28, 'Thanh Gươm Diệt Quỷ: Vô Hạn Thành', 115, 'Haruo Sotozaki', 'Yoshitsugu Matsuoka, Saori Hayami, Natsuki Hanae', 'Mở đầu cho trận chiến cuối cùng chống lại Muzan, phần tiếp theo của "Kimetsu no Yaiba" là phim chiếu rạp mới nhất về phần
Vô Hạn Thành
. Phim gây ấn tượng mạnh với đồ họa sống động, âm thanh hoành tráng và những trận chiến mãn nhãn.', '2025-08-15', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(29, 'Mang Mẹ Đi Bỏ', 113, 'Mo Hong-jin', 'chính: Tuấn Trần, Jung Il-woo, Hồng Đào', 'Phim chiếu rạp tháng 8
"Mang Mẹ Đi Bỏ"
kể về cuộc đời đầy bi kịch nhưng cũng rất nhân văn của Hoan. Ngoài việc mưu sinh bằng nghề cắt tóc dạo, anh còn là người chăm sóc chính cho mẹ mình, người đang mắc chứng mất trí nhớ (Alzheimer).', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(30, 'Thám Tử Lừng Danh Conan: Dư Ảnh Của Độc Nhãn', 110, 'Katsuya Shigehara', 'Wakana Yamazaki, Minami Takayama, Megumi Hayashibara, Rikiya Koyama', 'Phần phim chiếu rạp mới nhất của Conan đưa người xem theo chân cậu thám tử nhí phá giải vụ án tại ngọn núi tuyết Nagano. Conan và nhóm thám tử bất ngờ trở về quá khứ để phá một vụ án bí ẩn. Thanh tra Yamato Kansuke phải đối mặt với ký ức đau thương từ trận tuyết lở năm xưa.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(31, 'Bộ Tứ Siêu Đẳng: Bước Đi Đầu Tiên', 130, 'Matt Shakman', 'chính: Vanessa Kirby, Pedro Pascal, Joseph Quinn, Ebon Moss-Bachrach', 'Marvel Studios tái khởi động thương hiệu “Fantastic Four” với cách tiếp cận mới mẻ, tập trung vào hành trình đầu tiên của nhóm siêu anh hùng. Kỹ xảo hoành tráng, cốt truyện lôi cuốn và dàn diễn viên tài năng chắc chắn sẽ khiến bộ phim trở thành một trong những phim chiếu rạp hay nhất 2025. Ra mắt đúng mùa phim chiếu rạp tháng 8, tác phẩm hứa hẹn là bom tấn mở màn cho nhiều dự án Marvel tiếp theo.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(32, 'Toàn Trí Độc Giả', 128, 'Kim Byung-woo', 'chính: Ahn Hyo-seop, Lee Min-ho, Kim Ji-soo, Chae Soo-bin', 'Chuyển thể từ tiểu thuyết nổi tiếng,
“Toàn Trí Độc Giả”
là phim chiếu rạp mới nhất của xứ sở Kim Chi đang gây sốt. Phim kể về chàng trai duy nhất biết trước diễn biến của thế giới qua một cuốn tiểu thuyết.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(33, 'Zombie Cưng Của Ba', 107, 'Pil Gam Sung', 'Meowmeow, Cho Jung Seok', 'Với màn tái xuất ấn tượng của Cho Jung Seok,
“Zombie Cưng Của Ba”
góp mặt trong danh sách phim chiếu rạp tháng 8 được mong đợi. Phim xoay quanh Lee Jung Hwan, một huấn luyện viên động vật đầy tâm huyết, phải đối mặt với thử thách lớn nhất đời: con gái anh trở thành zombie.', '2025-08-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/CTVSEO_Maihue/Phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(34, 'Địa Đạo: Mặt Trời Trong Bóng Tối', 110, 'Bùi Thạc Chuyên', 'Thái Hòa, Quang Tuấn, Uyển Ân, Diễm Hằng Lamoon, Hồ Thu Anh, Anh Tú Wilson', '“Địa Đạo: Mặt Trời Trong Bóng Tối”
mang đến một chương sử đầy kịch tính, nơi chiến tranh và dũng cảm hòa quyện. Bộ phim chiếu rạp 2025 này ấn tượng với những trận chiến ác liệt và khắc họa tâm lý nhân vật trong giây phút sinh tử. Câu chuyện về những anh hùng thầm lặng, chiến đấu không chỉ với kẻ thù mà còn với chính bản thân. Đây là phim chiếu rạp hay nhất, khiến từng phút giây trên màn ảnh đều là một trải nghiệm không thể rời mắt.', '2025-04-04', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/ph%E1%BB%8Bm%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2025-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(35, 'Qủy Nhập Tràng', 121, 'Pom Nguyễn', 'Quang Tuấn, Khả Như, NSND Thanh Nam, Vân Dung, NSƯT Phú Đôn, Trung Ruồi, Hoàng Mèo, Thanh Tân, Kiều Chi,…', 'Lấy cảm hứng từ câu chuyện có thật, “
Quỷ Nhập Tràng
” là bộ phim chiếu rạp 2025 kinh dị đầy ám ảnh. Câu chuyện kỳ bí về cỗ quan tài vô chủ trong ngôi làng hoang vắng mở ra những sự kiện kinh hoàng không thể giải thích. Những linh hồn và những hiện tượng siêu nhiên sẽ dày vò tâm trí bạn, khiến bạn không thể rời mắt khỏi
màn hình
. Liệu cái ác có thể bị đánh bại hay sẽ tiếp tục xâm chiếm cuộc sống của những người vô tội?', '2025-03-07', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/ph%E1%BB%8Bm%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2025-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(36, 'Flow', 89, 'Gints Zilbalodis', 'Đang cập nhật', '“Flow” (Lạc Trôi)
là hành trình kỳ diệu qua thế giới hoạt hình sắc màu, chạm đến trái tim người xem. Được đạo diễn bởi Gints Zilbalodis, bộ phim chiếu rạp 2025 kể về cuộc phiêu lưu của một chú mèo trong cuộc chiến giữa nỗi sợ và sự trưởng thành. Với hình ảnh tuyệt đẹp và thông điệp về tình bạn, “Flow” chắc chắn sẽ gây ấn tượng mạnh với các bạn nhỏ và yêu thích hoạt hình. Với những tình tiết cuốn hút, đây là bộ phim chiếu rạp hay nhất năm nay, chắc chắn sẽ khiến bạn mê mẩn từ đầu đến cuối.', '2025-03-07', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/ph%E1%BB%8Bm%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2025-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(37, 'Nhà gia tiên', 117, 'Huỳnh Lập', 'Huỳnh Lập, Phương Mỹ Chi, NSƯT Hạnh Thuý, NSƯT Huỳnh Đông, Puka', '“
Nhà Gia Tiên
” đưa bạn đến một cuộc hành trình hài hước và đầy bất ngờ giữa các thế hệ trong một gia đình. Bộ phim phản ánh những mối quan hệ đan xen, những tình huống hài hước nhưng cũng không thiếu những khoảnh khắc xúc động. Bộ phim chiếu rạp 2025 này sẽ khiến bạn không thể ngừng cười mà cũng phải suy ngẫm về những giá trị gia đình bền vững. Với dàn diễn viên gạo cội và những tình tiết sáng tạo, “Nhà Gia Tiên” mang đến cho bạn những phút giây thư giãn tuyệt vời.', '2025-02-21', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/ph%E1%BB%8Bm%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2025-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(38, 'Bộ tứ báo thủ', 110, 'Trấn Thành', 'chính: Trấn Thành, Lê Giang, Lê Dương Bảo Lâm, Uyển Ân', 'Bộ Tứ Báo Thủ
là phim chiếu rạp hay về thể loại hài – tình cảm xoay quanh cặp đôi Quỳnh Anh (Tiểu Vy) và Quốc Anh (Quốc Anh). Khi mối quan hệ bắt đầu đổ vỡ và xuất hiện nghi ngờ về người thứ ba (Kỳ Duyên), nhóm “báo thủ” gồm Mười Một (Trấn Thành), Dì Bốn (Lê Giang), Con Kiều (Uyển Ân) và Chét-Xi-Cà (Lê Dương Bảo Lâm) lập tức ra tay giúp đỡ.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(39, 'Nụ hôn bạc tỷ', 110, 'Thu Trang', 'chính: Lê Xuân Tiền, Tiến Luật, Ma Ran Đô, Đoàn Thiên Ân, Thu Trang', 'Nụ Hôn Bạc Tỷ
là phim chiếu rạp mới nhất thuộc thể loại hài – tình cảm, xoay quanh Thúy Vân (Thiên Ân) và chị gái Thúy Kiều (Thu Trang) trong hành trình “giải cứu” ngôi nhà bị cầm cố. Hai chị em vạch ra kế hoạch tiếp cận Quang (Lê Xuân Tiền) và Tú (Ma Ran Đô) – hai chàng thiếu gia giàu có – với hy vọng thay đổi cuộc sống. Bộ phim đan xen loạt tình huống dở khóc dở cười cùng những khoảnh khắc đầy cảm xúc.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(40, 'Yêu nhầm bạn thân', 110, 'Nguyễn Quang Dũng, Diệp Thế Vinh', 'chính: Kaity Nguyễn, Trần Ngọc Vàng, Thanh Sơn', 'Yêu Nhầm Bạn Thân
là phim chiếu rạp hay 2025 thuộc thể loại tình cảm – lãng mạn, kể về mối quan hệ giữa Bình An (Kaity Nguyễn) và Bảo Toàn (Trần Ngọc Vàng) – đôi bạn thân khác giới luôn bỏ lỡ nhau. Hành trình của họ trải dài từ miền biển đến núi rừng Việt Nam, vừa nên thơ vừa đầy thử thách.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(41, 'Paddington: Gấu Thủ Chu Du', 110, 'Dougal Wilson', 'chính: Hugh Bonneville, Emily Mortimer, Ben Whishaw', 'Paddington: Gấu Thủ Chu Du
là phim chiếu rạp mới nhất dành cho cả gia đình, chứa đựng thông điệp đẹp về tình thân không cùng huyết thống. Khi nghe tin dì Lucy mất tích tại Peru, chú gấu mê mứt cam cùng gia đình Brown quyết định lên đường tìm kiếm. Hành trình đưa họ vào sâu trong rừng Amazon với nhiều tình huống dở khóc dở cười.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(42, 'Wolf Man', 110, 'Leigh Whannell', 'chính: Christopher Abbott, Julia Garner, Matilda Firth', 'Wolf Man
là phim chiếu rạp full kinh dị mới nhất đến từ Blumhouse, do Leigh Whannell đạo diễn. Phim theo chân Blake (Christopher Abbott) – người đàn ông đang cố hàn gắn gia đình thì bị sinh vật lạ tấn công và dần biến thành người sói. Trong nỗ lực bảo vệ vợ con, anh buộc phải đối mặt với quá khứ và bản năng thú vật.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(43, 'Loài mèo trả ơn', 110, 'Hiroyuki Morita', 'chính: Chizuru Ikewaki, Yoshihiko Hakamada, Aki Maeda', 'Loài Mèo Trả Ơn
là phim chiếu rạp hay, tái phát hành bản hoạt hình kinh điển của Studio Ghibli. Câu chuyện theo chân Haru – nữ sinh vô tình cứu một chú mèo và bị cuốn vào Vương quốc Mèo kỳ lạ. Tại đây, cô suýt bị ép cưới hoàng tử Lune. Với sự giúp đỡ của mèo quý tộc Baron và những người bạn, Haru tìm cách trở về thế giới loài người.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(44, 'Những kẻ bất bại 2', 110, 'Christian Gudegast', 'chính: Gerard Butler, Jordan Bridges, O''Shea Jackson Jr', 'Những Kẻ Bất Bại 2: Pantera
là phần tiếp theo của phim chiếu rạp hành động ăn khách năm 2018. Big Nick (Gerard Butler) trở lại với cuộc truy đuổi tội phạm khốc liệt tại châu Âu. Anh lần theo Donnie – kẻ đang dính líu đến phi vụ cướp kim cương lớn do băng mafia Pantera cầm đầu. Phim mang đến những màn hành động nghẹt thở và đối đầu căng thẳng giữa cảnh sát và tội phạm quốc tế.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(45, 'Lời thì thầm của trái tim', 110, 'Yoshifumi Kondô', 'chính: Yoko Honna, Issei Takahashi, Takashi Tachibana', 'Lời Thì Thầm Của Trái Tim
là phim chiếu rạp 2025 đầy cảm xúc đến từ Studio Ghibli, kể về Shizuku – cô nữ sinh lớp 9 mê đọc sách, tình cờ gặp Seiji – chàng trai chung trường với ước mơ trở thành nghệ nhân làm đàn violin. Sự kết nối giữa hai tâm hồn trẻ tuổi đã khơi dậy đam mê và hành trình tìm kiếm bản thân.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-8.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(46, 'Yêu là đau', 110, 'Jonathan Eusebio', 'chính: Quan Kế Huy, Ariana DeBose, Daniel Wu', 'Yêu Là Đau
là phim chiếu rạp mới mang màu sắc tâm lý – tội phạm, xoay quanh Marvin Gable – một môi giới bất động sản tưởng như đã rũ bỏ quá khứ đen tối. Khi người đồng phạm cũ bất ngờ xuất hiện với lời cảnh báo, Marvin buộc phải quay lại thế giới ngầm. Cùng lúc, em trai anh – trùm tội phạm Alvin – cũng đang săn lùng anh.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-9.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(47, 'Đèn âm hồn', 110, 'Hoàng Nam', 'chính: Diễm Trang, Hoàng Kim Ngọc, Phú Thịnh, NSƯT Chiều Xuân', 'Đèn Âm Hồn
là phim chiếu rạp kinh dị, xoay quanh Thương – người vợ ở làng quê Bắc Bộ thời phong kiến, một mình nuôi con chờ chồng đi lính. Kể từ khi con trai nhặt được chiếc đèn kỳ lạ và xem chiếc bóng trên tường là “cha”, hàng loạt hiện tượng ma quái liên tiếp xuất hiện. Cây đèn được cho là vật triệu hồi ác linh, kéo theo bí ẩn chết chóc bao trùm cả ngôi làng.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/phim%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-10.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(48, 'Interstellar', 169, 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', '“
Interstellar
” trở lại với phiên bản IMAX ấn tượng, mang đến một cuộc phiêu lưu không gian đầy kỳ diệu và hoành tráng. Bộ phim chiếu rạp 2025 mở ra hành trình xuyên vũ trụ đầy thử thách và cảm xúc, từ lỗ đen đến các hành tinh xa xôi.', '2025-02-28', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/ph%E1%BB%8Bm%20chi%E1%BA%BFu%20r%E1%BA%A1p/phim-chieu-rap-2025-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(49, 'Red One: Mật Mã Đỏ', 125, 'Jake Kasdan', 'Wesley Kimmel, Mary Elizabeth Ellis, Lucy Liu, Nick Kroll, Kiernan Shipka', 'Red One: Mật Mã Đỏ là một trong những bộ phim chiếu rạp hay được mong đợi nhất năm 2024. Với cốt truyện hấp dẫn xoay quanh nhiệm vụ giải cứu quan trọng, phim sẽ đưa khán giả vào hành trình đầy căng thẳng và kịch tính.', '2024-11-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(50, 'Venom: Kèo Cuối', 109, 'Kelly Marcel', 'Tom Hardy, Juno Temple, Chiwetel Ejiofor, Clark Backo, Stephen Graham', 'Sau thành công của loạt phim Venom, phần mới nhất mang tên Venom: Kèo Cuối tiếp tục là phim chiếu rạp hay hứa hẹn mang lại nhiều giây phút căng thẳng và hồi hộp.', '2024-10-25', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(51, 'Đôi Bạn Học Yêu', 118, 'E. Oni', 'chính: Kim Go Eun, Steve Sanghyun Noh', 'Đôi Bạn Học Yêu - bộ phim tình cảm lãng mạn nhưng không kém phần hài hước, rất phù hợp cho những ai yêu thích những câu chuyện nhẹ nhàng và sâu lắng.', '2024-11-08', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(52, 'Cô Dâu Hào Môn', 114, 'Vũ Ngọc Đãng', 'Uyển Ân, Samuel An, Thu Trang, Lê Giang, Kiều Minh Tuấn, NSND Hồng Vân', 'Cô Dâu Hào Môn là một bộ phim hài hước, châm biếm sâu cay về cuộc sống hào môn, phơi bày những góc khuất và sự thật trần trụi đằng sau vẻ hào nhoáng.', '2024-10-18', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(53, 'Ted Yod: Quỷ Ăn Tạng 2', 111, 'Taweewat Wantha', 'Nadech Kugimiya, Denise Jelilcha Kapaun, Mim Rattawadee Wongthong, Junior Kajbhunditt Jaidee, Friend Peerakrit Phacharaboonyakiat, Nutthatcha Jessica Padovan', 'Đối với những ai đam mê chủ đề kinh dị, Ted Yod: Quỷ Ăn Tạng 2 là một trong những bộ phim chiếu rạp hay nhất, đặc biệt là với cốt truyện ma quái đầy ám ảnh.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(54, 'Mộ Đom Đóm', 89, 'Takahata Isao', 'Tatsumi Tsutomu, Shiraishi Ayano, Shinohara Yoshiko', 'Mộ Đom Đóm là một số phim rạp hay lấy bối cảnh thời kỳ chiến tranh, kể về cuộc sống gian nan của những đứa trẻ mồ côi.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(55, 'Đố Anh Còng Được Tôi', 118, 'Ryoo Seung-wan', 'Hwang Jung-min, Jung Hae-in', 'Đố Anh Còng Được Tôi là phim chủ đề hài kịch đậm chất Hàn Quốc, mang đến những tình huống dở khóc dở cười. Nó không chỉ mang đến tiếng cười mà còn chạm đến trái tim khán giả thông qua những câu chuyện chân thực về cuộc sống đời thường. Đố Anh Còng Được Tôi được dự đoán sẽ là một trong những bộ phim chiếu rạp hay và đáng xem nhất cuối năm 2024.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(56, 'Conan Movie 27', 111, 'Chika Nagaoka', 'Rikiya Koyama, Minami Takayama, Kenjirô Tsuda, Wakana Yamazaki', 'Conan Movie 27 là phần tiếp theo trong loạt phim nổi tiếng Thám tử Conan, một bộ phim chiếu rạp hay đầy kịch tính.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-8.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(57, 'Gia Tài Của Ngoại', 127, 'Pat Boonnitipat', 'Putthipong Assaratanakul (Billkin), Usha Seamkhum, Tontawan Tantivejakul,…', 'Gia Tài Của Ngoại là bộ phim Thái Lan mang đậm dấu ấn tình cảm gia đình và sự gắn kết giữa các thế hệ. Phim là sự kết hợp hài hòa giữa yếu tố hài hước và tình cảm gia đình, đem lại trải nghiệm xúc động cho khán giả.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-9.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(58, 'Deadpool 3: Deadpool và Wolverine', 127, 'Shawn Levy', 'Josh Brolin, Ryan Reynolds, Morena Baccarin', 'Sự hợp tác giữa hai nhân vật nổi tiếng Deadpool và Wolverine trong Deadpool 3: Deadpool và Wolverine chắc chắn là điểm nhấn của năm 2024.', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-hay-10.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(59, 'Gặp lại chị bầu', 110, 'Nhất Trung', 'Diệu Nhi, Anh Tú, Kiều Minh Tuấn…', 'Năm phát hành: Dự kiến vào ngày 10 tháng 2 năm 2024 - Mùng 1 Tết
Thể loại:Phim tình cảm, kịch, có yếu tố hài hước
Đạo diễn: Nhất Trung
Diễn viên: Diệu Nhi, Anh Tú, Kiều Minh Tuấn…
Xem phim tại nền tảng: Tại các rạp trên toàn quốc.', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(60, 'Bơi đêm - Night Swim', 98, 'Bryce McGuire', 'Kerry Condon, Wyatt Russell, Gavin Warren, Amélie Hoeferle…', 'Năm phát hành: Dự kiến ngày 05/01/2024
Thể loại:
Phim kinh dị
Thời lượng: 98 phút
Đạo diễn: Bryce McGuire
Diễn viên: Kerry Condon, Wyatt Russell, Gavin Warren, Amélie Hoeferle…
Xem phim tại nền tảng: Trên các rạp toàn quốc', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(61, 'Scarygirl - Arkie và ngày mặt trời mất tích', 93, 'Tania Vincent, Ricard Cussó', 'Rob Collins, Jillian Nguyen, Remy Hii, Sam Neill, Anna Torv', 'Năm phát hành: Dự kiến ngày 05/01/2024
Thể loại:
Phim hoạt hình chiếu rạp
Thời lượng: 93 phút
Đạo diễn: Tania Vincent, Ricard Cussó
Diễn viên: Rob Collins, Jillian Nguyen, Remy Hii, Sam Neill, Anna Torv...
Xem phim tại những rạp có trên toàn quốc', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(62, 'Cuốc xe chết - Hitch Hike', 74, 'Masafumi Yamada', 'Hayami Kyoko, Hirano Koshu, Hosoda Yoshihiko', 'Năm phát hành: Dự kiến 05/01/2024
Thể loại: Phim kinh dị, có yếu tố hồi hộp, gay cấn
Thời lượng: 74 phút
Đạo diễn: Masafumi Yamada
Diễn viên: Hayami Kyoko, Hirano Koshu, Hosoda Yoshihiko
Xem phim tại các rạp', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(63, 'The Book of Clarence', 129, 'Jeymes Samuel', 'LaKeith Stanfield, David Oyelowo, Xi lanh RJ, Omar Sỹ, Anna Diop', 'Năm phát hành: Dự kiến 12/01/2024
Thể loại: Phim sử thi, lịch sử
Thời lượng: 129 phút
Đạo diễn: Jeymes Samuel
Diễn viên: LaKeith Stanfield, David Oyelowo, Xi lanh RJ, Omar Sỹ, Anna Diop...', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(64, 'Alienoid 2: Return To The Future', 122, 'Choi Dong-hoon', 'Ryu Jun-yeol, Kim Woo-bin, Lee Ha-nee, Kim Tae-Ri, Yum Jung-ah, Kim Eui-sung, Jo Woo-jin, Jin Sun-kyu', 'Năm phát hành: Dự kiến 12/01/2024
Thể loại:
Phim chiếu rạp
hành động, xuyên không, phiêu lưu
Thời lượng: 122 phút
Đạo diễn: Choi Dong-hoon
Diễn viên: Ryu Jun-yeol, Kim Woo-bin, Lee Ha-nee, Kim Tae-Ri, Yum Jung-ah, Kim Eui-sung, Jo Woo-jin, Jin Sun-kyu', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(65, 'Mật vụ ong - The Bhe Beekeeper', 110, 'David Ayer', 'Jason Statham, Bobby Naderi, Emmy Raver-Lampman…', 'Năm phát hành: Dự kiến 12/01/2024
Thể loại:
Phim võ thuật
hành động, các yếu tố gay cấn
Đạo diễn: David Ayer
Diễn viên: Jason Statham, Bobby Naderi, Emmy Raver-Lampman…', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(66, 'Bob Marley: One Love', 110, 'của bộ phim: Reinaldo Marcus Green', 'Kingsley Ben-Adir', 'Bộ phim nói về tiểu sử của ngôi sao nhạc reggae nổi tiếng Bob Marley. Bên cạnh đó, bộ phim cũng tập trung truyền đạt những giá trị âm nhạc vượt thời gian mà Bob Marley đã đóng góp. Khán giả sẽ có cơ hội hiểu rõ hơn về tài năng và con người của ngôi sao này thông qua tác phẩm này.', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-8.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(67, 'Argylle Siêu Điệp Viên', 110, 'Matthew Vaughn', 'Henry Cavill, Dua Lipa, Bryce Dallas Howard, Sam Rockwell…', 'Năm phát hành: Dự kiến ngày 10 tháng 2 năm 2024 - Mùng 1 Tết
Thể loại: Phim hành động, có yếu tố kịch tính
Đạo diễn: Matthew Vaughn
Diễn viên: Henry Cavill, Dua Lipa, Bryce Dallas Howard, Sam Rockwell…', '2026-10-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/05/phim-chieu-rap-9.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(68, 'Nhà bà Nữ', 102, 'Trấn Thành', 'chính: Trấn Thành, Lê Giang, NSND Ngọc Giàu, Uyển Ân, Khả Như, NSND Việt Anh, NSƯT Công Ninh, Ngân Quỳnh, Song Luân, Lê Dương Bảo Lâm', 'Nhà bà Nữ là bộ phim chiếu rạp Việt Nam do Trấn Thành sản xuất và đạo diễn, sau thành công của Bố già. Kể từ ngày công chiếu, bộ
phim Việt Nam
này đã có doanh thu lên đến 358 tỷ đồng và được đón nhận bởi đông đảo khán giả Việt.', '2023-01-22', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-1.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(69, 'Vong nhi', 117, 'Hoàng Tuấn Cường', 'chính: Lê Phương, Nhật Kim Anh, Lệ Hằng, Quốc Huy', 'Nội dung phim ''Vong nhi'' tập trung vào nạn phá thai và bi kịch gia đình. Câu chuyện diễn ra trong gia đình Thảo (do Lê Phương thủ vai). Thảo từng dắt em mình đi phá thai và liên tục gặp ám ảnh về một vong nhi nào đó, đặc biệt trong thời kỳ cô mang bầu. Với yếu tố kinh dị xen lẫn bi kịch đời thường trong gia đình, bộ phim hứa hẹn khiến người xem phải giật thót tim nhiều lần. Đây là thể loại phim chiếu rạp kinh dị đáng sợ có thật hay nhất 2024.', '2023-02-03', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-2.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(70, 'BTS: YET TO COME IN CINEMAS', 103, 'Diễn viên chính: Nhóm nhạc BTS (Jung Kool, V, Jimin, Jin, RM, SUGA, j-Hope)', 'chính: Nhóm nhạc BTS (Jung Kool, V, Jimin, Jin, RM, SUGA, j-Hope)', 'Các thành viên của BTS sẽ cùng nhau xuất hiện trên sân khấu phiên bản chiếu rạp đặc biệt này. Họ sẽ thể hiện các ca khúc hot hit như Dynamite, IDOL, Butter với sự dàn dựng công phu nhất. Vì vậy, đây chắc chắn là phim chiếu rạp hay nhất đối với ARMY trong năm 2024. Hãy cùng đón xem và tận hưởng các điệu nhạc sôi động nhất cùng các chàng trai Kpop này nhé.', '2023-02-03', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-3.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(71, 'M3GAN', 102, 'Gerard Johnstone', 'chính: Allison Williams, Violet McGraw, Brian Jordan Alvarez, Jen Van Epps, Ronny Chieng, …', 'M3GAN là bộ phim chiếu rạp kinh dị đáng xem nhất trong đầu năm 2024. Bộ phim này nói về M3GAN - một con robot thông minh. M3GAN được người dì Gemma tạo nên và đưa về nhà làm bạn với cháu của mình là Cady. Mối quan hệ giữa Cady và M3GAN ngày càng thân thiết. M3GAN xem Cady là bạn và chủ của mình, nên sẵn sàng làm hại bất cứ ai tổn thương đến cô bé.', '2023-01-27', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-4.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(72, 'Chị chị em em 2', 115, 'Vũ Ngọc Đãng', 'chính: Ngọc Trinh, Minh Hằng, Lê Giang và nhiều diễn viên khác', 'Bộ phim chiếu rạp hay nhất 2024 ''Chị chị em em 2'' được xây dựng dựa trên giai thoại nổi tiếng về mỹ nhân Ba Trà và Tư Nhị. Ba Trà (do Minh Hằng đảm vai) là một mỹ nhân “sắc nước hương trời lại giàu có bậc nhất Sài Thành lúc bấy giờ. Trong một lần, Ba Trà gặp Tư Nhị (Ngọc Trinh) và nhận cô làm em gái nuôi. Phần còn lại của phim là hành trình lột xác của Tư Nhị, nhằm chiếm đoạt vị trí đệ nhất mỹ nhân của Ba Trà.', '2023-01-22', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-5.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(73, 'BABYLON', 188, 'Damien Chazelle', 'chính: Brad Pitt, Diego Calva, Margot Robbie và nhiều diễn viên khác', 'BABYLON được công chiếu lần đầu vào ngày 14/11/2023 tại Los Angeles. Bộ phim chiếu rạp hài hước BABYLON tập trung khai thác những thăng trầm của nhiều nhân vật trong quá trình chuyển đổi của Hollywood, từ phim câm sang phim có tiếng (cuối những năm 1920). Với sự đầu tư khủng (kinh phí gần 80 triệu đô la), bộ phim được mệnh danh là
phim bom tấn
oanh tạc phòng vé và gây ra nhiều luồng đánh giá từ các nhà phê bình.', '2023-02-03', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-6.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(74, 'Avatar: Dòng chảy của nước', 192, 'James Cameron', 'chính: Sam Worthington, Zoe Saldana', 'Avatar: Dòng chảy của nước hay còn gọi là Avatar 2, tức phần 2 của Avatar (2009)- một trong những bộ phim chiếu rạp hay nhất mọi thời đại. Trong phim, gia đình Na’vi đứng trước mối đe dọa mới từ con người. Họ khám phá ra hành tinh Pandora và gặp hàng loạt thử thách mới. Bộ phim này tiếp tục khiến khán giả trầm trồ với chất lượng hình ảnh và sự đầu tư trong việc xây dựng thế giới giả tưởng như thật.', '2022-12-16', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-7.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(75, 'Mèo Đi Hia: Điều ước cuối cùng', 103, 'Joel Crawford', 'chính: Antonio Banderas, Salma Hayek, Harvey Guillén, …', 'Nếu bạn đang tìm kiếm phim chiếu rạp hoạt hình đáng xem nhất đầu năm 2024, Mèo Đi Hia: Điều ước cuối cùng là lựa chọn tuyệt vời. Bộ phim này kể về cuộc phiêu lưu của Puss, một chú mèo đam mê thám hiểm và đầy khí chất.', '2022-12-30', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-8.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(76, 'Mèo béo siêu đẳng', 93, 'Toby Genkel và Florian Westermann', 'chính: Hugh Laurie, Emilia Clarke, Himesh Patel, Hugh Bonneville, …', 'Phim chiếu rạp hoạt hình “Mèo béo siêu đẳng” kể về hành trình của chú mèo Maurice, một con
chuột
tinh quái và cậu bé loài người Keith. Họ cùng nhau hợp tác nhằm thực hiện các phi vụ lừa đảo. Tuy nhiên, trong một lần đến thị trấn Bad Blintz, họ phát hiện ra những kẻ xấu xa thực sự đang âm mưu làm hại con người.', '2023-01-25', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-9.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(77, 'Tiếng gõ ở căn nhà gỗ', 100, 'M. Night Shyamalan', 'chính: Dave Bautista, Rupert Grint, Ben Aldridge, …', 'Tiếng gõ ở căn nhà gỗ (Knock at the Cabin) là bộ phim chiếu rạp điện ảnh Mỹ với thể loại chính kịch - kinh dị. Phim theo chân một gia đình, gồm Andrew, Eric và con gái Wen trong chuyến nghỉ mát trong căn nhà gỗ.', '2023-02-03', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-10.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(78, 'Bay vào tử địa', 108, 'Jean-François Richet', 'chính: Mike Colter, Gerard Butler và Daniella Pineda', 'Trong một chuyến bay của cơ trưởng Brodie, máy bay bất ngờ bị sét đánh và rơi xuống một quần đảo bí ẩn do phiến quân chiếm đóng. Các thành viên trên máy bay buộc phải chiến đấu cùng nhau để giành lấy sự sống. Điều này buộc cơ trưởng Brodie phải hợp tác với một kẻ sát nhân. Liệu họ có thành công trong cuộc chiến sống còn này? Hãy đón xem phim “Bay vào tử địa” tại rạp ngay bây giờ nhé.', '2023-02-03', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-11.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(79, 'Qúy ông số “Đỏ”', 124, 'Kim Kyeong-won', 'chính: Ju Ji-hoon, Park Sung-woong, Kang Hong-suk, …', 'Qúy ông số “Đỏ” là phim chiếu rạp Hàn Quốc khai thác chủ đề tội phạm. Nội dung phim xoay quanh nhân vật chính Ji Hyun Soo (do Ju Ji-hoon đảm vai), người điều hành một công ty thám tử tư. Trong một vụ án, anh ta bị tình nghi là nghi phạm bắt cóc khách hàng của mình.', '2023-01-27', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-12.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(80, 'Nhắn gửi một tôi, người đã yêu em', 99, 'Kenichi Kasai', 'chính: Aju Makita và Hio Miyazawa', 'Đây là bộ phim chiếu rạp hoạt hình anime chuyển thể còn lại của tác giả Otono Yomoji. Cùng với “Nhắn gửi tất cả các em, những người tôi đã yêu”, bộ phim này mang đến một câu chuyện tình yêu lãng mạn, trong sáng nhưng cũng đầy trắc trở.', '2023-02-10', '2026-12-31', 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/02/phim-chieu-rap-15.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(81, '“NÓ” ở trong rừng', 107, 'Hideo Nakata', 'chính: Noriko Eguchi, Aiba Masaki và nhiều diễn viên khác', '“NÓ” ở trong rừng là phim kinh dị của đạo diễn người Nhật Hideo Nakata sau thành công của Ring (1998). Phim lấy bối cảnh tại khu rừng già Fukushima, nơi xảy ra nhiều câu chuyện kỳ lạ, bí ẩn. Các cảnh quay chân thực trong khu rừng và các vụ án đẫm máu hứa hẹn khiến người xem hứng thú.', '2023-02-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-16.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(82, 'Ant-Man and the Wasp: Quantumania', 110, 'Peyton Reed', 'chính: Paul Rudd, Jonathan Majors và Evangeline Lilly', 'Đây là phim chiếu rạp sắp ra mắt từ Marvel Studio và là phần tiếp theo của Người kiến và Chiến binh ong (2018). Phim này tiếp tục có sự trở lại của Scott Lang (Người Kiến) và Hope Pym (Chiến binh Ong). Họ cùng nhau khám phá thế giới lượng tử và gặp gỡ nhiều sinh vật kỳ lạ khác.', '2023-02-17', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-17.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(83, 'Mất tích (Missing)', 111, 'Nick Johnson, Will Merrick', 'chính: Storm Reid, Nia Long, Tim Griffin, Daniel, …', 'Phim tập trung vào nhân vật chính tên June, một cô gái trẻ thông minh và nhạy bén. Cô sống cùng mẹ của mình, Grace, sau khi cha cô mất vì bị u não. Trong một lần, Grace có chuyến nghỉ dưỡng đến Colombia cùng bạn trai mới, Kevin. Sau đó, họ không trở về nữa vì bị ai đó bắt cóc.', '2023-02-24', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-18.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(84, 'Shazam! Cơn thịnh nộ của các vị thần', 110, 'David F. Sandberg', 'chính: Zachary Levi, Asher Angel, Adam Brody, Ross Butler, Jack Dylan Grazer, và nhiều diễn viên khác', '“Shazam! Cơn thịnh nộ của các vị thần” là phần hậu truyện của Shazam! (2019) và là phim thứ 14 trong DCEU (Vũ trụ mở rộng DC). Bộ phim siêu anh hùng này sắp ra mắt tại các chiếu phim trên toàn quốc kể từ 17/03/2023.', '2023-03-17', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-19.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(85, 'Siêu lừa gặp siêu lầy', 135, 'Võ Thanh Hòa', 'chính: Anh Tú, Mạc Văn Khoa, Nhất Trung, NSƯT Mỹ Duyên, Lâm Vỹ Dạ, BB Trần, và nhiều diễn viên khác', 'Nội dung phim xoay quanh các vụ lừa đảo của bộ đôi Khoa (Mạc Văn Khoa) và Tú (Anh Tú). Họ gặp nhau tại đảo ngọc Phú Quốc và hợp tác làm nhiều phi vụ lớn nhỏ. Tuy nhiên, họ vô tình gây ra vô số tình huống dở khóc dở cười vì sự thiếu chuyên nghiệp của mình.', '2023-03-24', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-21.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(86, 'Trận chiến thời tiền sử', 110, 'Scott Beck và Bryan Woods', 'chính: Adam Driver, Chloe Coleman, Ariana Greenblatt, …', 'Sau cú va chạm thảm khốc của tàu vũ trụ, nhóm thám hiểm của Mills (Adam Driver) bay thẳng vào một hành tinh lạ. Đây là hành tinh Trái Đất nhưng vào thời tiền sử, tức vào hơn 65 triệu năm trước.', '2023-03-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-22.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(87, 'Muốn gặp anh', 107, 'Tienjen Huang', 'chính: Alice Ko, Patrick Shih, và Greg Hsu', 'Không để khán giả chờ đợi lâu, bộ phim “Muốn gặp anh” phiên bản điện ảnh dự kiến công chiếu từ ngày 10/02/2023. Đây là phim chiếu rạp đáng xem nhất của màn điện ảnh xứ Đài với câu chuyện tình yêu vượt không gian, thời gian.', '2023-02-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-23.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(88, 'TITANIC', 194, 'James Cameron', 'chính: Leonardo DiCaprio, Billy Zane và Kate Winslet', 'Bộ phim TITANIC đình đám dự kiến trở lại màn ảnh rộng vào ngày 10/02, nhằm kỷ niệm 25 năm lần công chiếu đầu tiên. Bộ phim này từng gây sốt trên toàn cầu với tài kể chuyện của đạo diễn James Cameron và cặp đôi Jack Dawson - Rose DeWitt Bukater.', '2023-02-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-24.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(89, 'Magic Mike: Vũ điệu cuối cùng', 124, 'Steven Soderbergh', 'chính: Channing Tatum và Salma Hayek', 'Sau khi việc kinh doanh không mấy khởi sắc, chàng vũ công Mike quyết định ký hợp đồng làm bartender tại một bãi biển thuộc Florida. Tại đây, anh gặp gỡ một người phụ nữ thượng lưu và có một đêm mặn nồng.', '2023-02-14', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/quynh/phim-chieu-rap-25.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(90, 'Bài viết liên quan', 110, 'Đang cập nhật', 'Đang cập nhật', 'Phim chiếu rạp tháng 10/2026: Các tác phẩm đáng chú ý
Khánh
Minh
29/09/2026 15:57
Top 10+ tựa phim của Sadie Sink gây sốt không thể bỏ lỡ
Khánh
Minh
29/08/2026 19:29
Các bộ phim của Zendaya đáng chú ý từ truyền hình đến điện ảnh
Khánh
Minh
25/08/2026 16:48
Thống kê tất cả các tập phim loạt phim Naruto qua các mùa
Trâm
Phạm
27/07/2026 11:18
Top phim chiếu rạp Việt Nam có trên Netflix đáng xem nhất hiện nay
Trâm
Phạm
24/06/2026 10:44
Thứ tự các tập phim Harry Potter đầy đủ chi tiết
Khánh
Minh
23/06/2026 15:58', '2026-10-10', '2026-12-31', 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/phim-chieu-rap-thang-10-2026/phim-chieu-rap-thang-10-2026-thumb.jpg', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(91, 'Top 10+ tựa phim của Sadie Sink gây sốt không thể bỏ lỡ', 110, 'Đang cập nhật', 'Đang cập nhật', 'Phim chiếu rạp đặc sắc Top 10+ tựa phim của Sadie Sink gây sốt không thể bỏ lỡ với sự tham gia của dàn diễn viên nổi tiếng, cốt truyện hấp dẫn và kỹ xảo điện ảnh đỉnh cao.', '2026-10-10', '2026-12-31', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(92, 'Các bộ phim của Zendaya đáng chú ý từ truyền hình đến điện ảnh', 110, 'Đang cập nhật', 'Đang cập nhật', 'Phim chiếu rạp đặc sắc Các bộ phim của Zendaya đáng chú ý từ truyền hình đến điện ảnh với sự tham gia của dàn diễn viên nổi tiếng, cốt truyện hấp dẫn và kỹ xảo điện ảnh đỉnh cao.', '2026-10-10', '2026-12-31', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(93, 'Thống kê tất cả các tập phim loạt phim Naruto qua các mùa', 110, 'Đang cập nhật', 'Đang cập nhật', 'Phim chiếu rạp đặc sắc Thống kê tất cả các tập phim loạt phim Naruto qua các mùa với sự tham gia của dàn diễn viên nổi tiếng, cốt truyện hấp dẫn và kỹ xảo điện ảnh đỉnh cao.', '2026-10-10', '2026-12-31', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING'),
(94, 'Thứ tự các tập phim Harry Potter đầy đủ chi tiết', 110, 'Đang cập nhật', 'Đang cập nhật', 'Phim chiếu rạp đặc sắc Thứ tự các tập phim Harry Potter đầy đủ chi tiết với sự tham gia của dàn diễn viên nổi tiếng, cốt truyện hấp dẫn và kỹ xảo điện ảnh đỉnh cao.', '2026-10-10', '2026-12-31', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'NOW_SHOWING')
ON DUPLICATE KEY UPDATE `MovieName`=VALUES(`MovieName`), `PosterURL`=VALUES(`PosterURL`), `Description`=VALUES(`Description`), `Status`=VALUES(`Status`);

-- Chèn liên kết thể loại phim moviecategories
INSERT IGNORE INTO `moviecategories` (`MovieID`, `CategoryID`) VALUES
(10, 5),
(10, 7),
(11, 3),
(11, 12),
(12, 4),
(12, 9),
(12, 13),
(13, 1),
(13, 10),
(14, 4),
(14, 9),
(15, 8),
(15, 11),
(16, 4),
(16, 6),
(17, 1),
(17, 2),
(17, 14),
(18, 4),
(18, 9),
(18, 13),
(19, 4),
(19, 8),
(20, 7),
(20, 14),
(21, 1),
(21, 6),
(21, 9),
(22, 8),
(23, 1),
(23, 2),
(24, 4),
(24, 8),
(24, 9),
(25, 5),
(25, 6),
(25, 12),
(26, 1),
(27, 1),
(28, 1),
(28, 14),
(29, 3),
(29, 6),
(29, 8),
(30, 5),
(31, 2),
(31, 7),
(32, 1),
(33, 6),
(33, 12),
(34, 1),
(35, 4),
(36, 7),
(37, 6),
(37, 12),
(38, 3),
(38, 6),
(39, 6),
(40, 6),
(41, 5),
(41, 12),
(42, 4),
(43, 5),
(43, 7),
(44, 1),
(45, 5),
(45, 8),
(46, 1),
(46, 6),
(47, 4),
(47, 13),
(48, 2),
(48, 7),
(49, 1),
(49, 6),
(50, 1),
(50, 2),
(50, 7),
(51, 6),
(52, 8),
(53, 4),
(54, 5),
(55, 1),
(55, 6),
(56, 3),
(56, 5),
(57, 8),
(58, 1),
(59, 3),
(59, 6),
(60, 4),
(61, 5),
(62, 4),
(63, 1),
(64, 1),
(65, 10),
(66, 11),
(67, 1),
(68, 3),
(68, 12),
(69, 4),
(70, 1),
(71, 4),
(72, 6),
(72, 8),
(73, 6),
(73, 8),
(74, 2),
(75, 5),
(75, 6),
(75, 7),
(76, 5),
(77, 4),
(78, 1),
(79, 1),
(80, 2),
(80, 3),
(80, 5),
(81, 4),
(82, 1),
(82, 2),
(83, 8),
(84, 1),
(85, 6),
(86, 4),
(86, 7),
(87, 3),
(88, 3),
(89, 3),
(90, 1),
(91, 1),
(92, 1),
(93, 1),
(94, 1);

-- Chèn lịch chiếu thực tế showtimes cho các phim ĐANG CHIẾU
INSERT INTO `showtimes` (`ShowtimeID`, `MovieID`, `RoomID`, `ShowDate`, `StartTime`, `EndTime`, `Format`, `Price`, `Status`) VALUES
(101, 10, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(102, 10, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(103, 10, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(104, 10, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(105, 11, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(106, 11, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(107, 11, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(108, 11, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(109, 12, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(110, 12, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(111, 12, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(112, 12, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(113, 13, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(114, 13, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(115, 13, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(116, 13, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(117, 14, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(118, 14, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(119, 14, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(120, 14, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(121, 15, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(122, 15, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(123, 15, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(124, 15, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(125, 16, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(126, 16, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(127, 16, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(128, 16, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(129, 17, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(130, 17, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(131, 17, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(132, 17, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(133, 18, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(134, 18, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(135, 18, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(136, 18, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(137, 19, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(138, 19, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(139, 19, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(140, 19, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(141, 20, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(142, 20, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(143, 20, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(144, 20, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(145, 21, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(146, 21, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(147, 21, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(148, 21, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(149, 22, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(150, 22, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(151, 22, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(152, 22, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(153, 23, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(154, 23, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(155, 23, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(156, 23, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(157, 24, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(158, 24, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(159, 24, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(160, 24, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(161, 25, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(162, 25, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(163, 25, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(164, 25, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(165, 27, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(166, 27, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(167, 27, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(168, 27, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(169, 28, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(170, 28, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(171, 28, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(172, 28, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(173, 29, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(174, 29, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(175, 29, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(176, 29, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(177, 30, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(178, 30, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(179, 30, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(180, 30, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(181, 31, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(182, 31, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(183, 31, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(184, 31, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(185, 32, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(186, 32, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(187, 32, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(188, 32, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(189, 33, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(190, 33, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(191, 33, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(192, 33, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(193, 34, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(194, 34, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(195, 34, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(196, 34, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(197, 35, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(198, 35, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(199, 35, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(200, 35, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(201, 36, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(202, 36, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(203, 36, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(204, 36, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(205, 37, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(206, 37, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(207, 37, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(208, 37, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(209, 38, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(210, 38, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(211, 38, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(212, 38, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(213, 39, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(214, 39, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(215, 39, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(216, 39, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(217, 40, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(218, 40, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(219, 40, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(220, 40, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(221, 41, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(222, 41, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(223, 41, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(224, 41, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(225, 42, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(226, 42, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(227, 42, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(228, 42, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(229, 43, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(230, 43, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(231, 43, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(232, 43, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(233, 44, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(234, 44, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(235, 44, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(236, 44, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(237, 45, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(238, 45, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(239, 45, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(240, 45, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(241, 46, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(242, 46, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(243, 46, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(244, 46, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(245, 47, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(246, 47, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(247, 47, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(248, 47, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(249, 48, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(250, 48, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(251, 48, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(252, 48, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(253, 49, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(254, 49, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(255, 49, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(256, 49, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(257, 50, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(258, 50, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(259, 50, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(260, 50, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(261, 51, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(262, 51, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(263, 51, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(264, 51, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(265, 52, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(266, 52, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(267, 52, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(268, 52, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(269, 53, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(270, 53, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(271, 53, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(272, 53, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(273, 54, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(274, 54, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(275, 54, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(276, 54, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(277, 55, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(278, 55, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(279, 55, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(280, 55, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(281, 56, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(282, 56, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(283, 56, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(284, 56, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(285, 57, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(286, 57, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(287, 57, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(288, 57, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(289, 58, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(290, 58, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(291, 58, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(292, 58, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(293, 59, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(294, 59, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(295, 59, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(296, 59, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(297, 60, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(298, 60, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(299, 60, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(300, 60, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(301, 61, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(302, 61, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(303, 61, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(304, 61, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(305, 62, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(306, 62, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(307, 62, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(308, 62, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(309, 63, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(310, 63, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(311, 63, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(312, 63, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(313, 64, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(314, 64, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(315, 64, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(316, 64, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(317, 65, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(318, 65, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(319, 65, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(320, 65, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(321, 66, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(322, 66, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(323, 66, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(324, 66, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(325, 67, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(326, 67, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(327, 67, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(328, 67, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(329, 68, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(330, 68, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(331, 68, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(332, 68, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(333, 69, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(334, 69, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(335, 69, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(336, 69, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(337, 70, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(338, 70, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(339, 70, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(340, 70, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(341, 71, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(342, 71, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(343, 71, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(344, 71, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(345, 72, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(346, 72, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(347, 72, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(348, 72, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(349, 73, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(350, 73, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(351, 73, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(352, 73, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(353, 74, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(354, 74, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(355, 74, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(356, 74, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(357, 75, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(358, 75, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(359, 75, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(360, 75, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(361, 76, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(362, 76, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(363, 76, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(364, 76, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(365, 77, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(366, 77, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(367, 77, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(368, 77, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(369, 78, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(370, 78, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(371, 78, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(372, 78, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(373, 79, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(374, 79, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(375, 79, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(376, 79, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(377, 80, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(378, 80, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(379, 80, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(380, 80, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(381, 81, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(382, 81, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(383, 81, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(384, 81, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(385, 82, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(386, 82, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(387, 82, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(388, 82, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(389, 83, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(390, 83, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(391, 83, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(392, 83, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(393, 84, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(394, 84, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(395, 84, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(396, 84, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(397, 85, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(398, 85, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(399, 85, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(400, 85, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(401, 86, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(402, 86, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(403, 86, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(404, 86, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(405, 87, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(406, 87, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(407, 87, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(408, 87, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(409, 88, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(410, 88, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(411, 88, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(412, 88, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(413, 89, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(414, 89, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(415, 89, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(416, 89, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(417, 90, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(418, 90, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(419, 90, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(420, 90, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(421, 91, 2, '2026-10-16', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(422, 91, 3, '2026-10-17', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(423, 91, 4, '2026-10-18', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(424, 91, 1, '2026-10-19', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(425, 92, 3, '2026-10-16', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(426, 92, 4, '2026-10-17', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(427, 92, 1, '2026-10-18', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(428, 92, 2, '2026-10-19', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(429, 93, 4, '2026-10-16', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE'),
(430, 93, 1, '2026-10-17', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(431, 93, 2, '2026-10-18', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(432, 93, 3, '2026-10-19', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(433, 94, 1, '2026-10-16', '09:30:00', '11:30:00', '2D', 90000, 'ACTIVE'),
(434, 94, 2, '2026-10-17', '14:15:00', '16:30:00', '2D', 95000, 'ACTIVE'),
(435, 94, 3, '2026-10-18', '18:45:00', '21:00:00', 'IMAX 2D', 130000, 'ACTIVE'),
(436, 94, 4, '2026-10-19', '21:30:00', '23:45:00', 'Dolby Atmos', 120000, 'ACTIVE')
ON DUPLICATE KEY UPDATE `Price`=VALUES(`Price`);

SET FOREIGN_KEY_CHECKS = 1;
