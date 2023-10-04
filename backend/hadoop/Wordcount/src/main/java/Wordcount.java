import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;
import org.bson.Document;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.PriorityQueue;
import java.util.TimeZone;

public class Wordcount {
    public Wordcount() {
    }

    static public String getDate() {
        ZoneId seoulZone = ZoneId.of("Asia/Seoul"); // 서울 시간대 설정
        ZonedDateTime seoulTime = ZonedDateTime.now(seoulZone); // 현재 서울 시간 얻기

        DateTimeFormatter saveFormatter = DateTimeFormatter.ofPattern("yyyyMMdd"); // 날짜 포맷
        String saveDate = seoulTime.format(saveFormatter);

        return saveDate;
    }
    public static class TokenizerMapper
            extends Mapper<Object, Text, Text, IntWritable> {

        private final static IntWritable one = new IntWritable(1);
        private Text word = new Text();

        public void map(Object key, Text value, Context context)
                throws IOException, InterruptedException {
            String[] words = value.toString().split("[\\n,]+");

            for (String w : words) {
                if(w.length() <= 1) continue;
                word.set(w);
                context.write(word, one);
            }
        }
    }

    public static class IntSumReducer
            extends Reducer<Text, IntWritable, Text, IntWritable> {

        private Map<Text, Integer> topN = new HashMap<>();
        private final int N = 100; // 상위 N개를 추적

        public void reduce(Text key, Iterable<IntWritable> values, Context context)
                throws IOException, InterruptedException {
            int sum = 0;
            for (IntWritable val : values) {
                sum += val.get();
            }

            // ,를 모두 빈칸으로 대체하여 저장하기
            topN.put(new Text(key.toString().replaceAll(",", "")), sum);

            if (topN.size() > N) {
                int min = Integer.MAX_VALUE;
                Text minKey = null;
                for (Entry<Text, Integer> entry : topN.entrySet()) {
                    if (entry.getValue() < min) {
                        min = entry.getValue();
                        minKey = entry.getKey();
                    }
                }
                topN.remove(minKey);
            }
        }


        protected void cleanup(Context context) throws IOException, InterruptedException {
            PriorityQueue<Entry<Text, Integer>> pq = new PriorityQueue<>((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue()));
            pq.addAll(topN.entrySet());
//            LocalDateTime currentDate = LocalDateTime.now(); // 날짜 가져오기
//
//            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // 날짜 포맷
//            String formattedDate = currentDate.format(formatter); // 현재 날짜 형태 변경해서 가져오기
            ZoneId seoulZone = ZoneId.of("Asia/Seoul"); // 서울 시간대 설정
            ZonedDateTime seoulTime = ZonedDateTime.now(seoulZone); // 현재 서울 시간 얻기

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // 원하는 날짜 및 시간 형식
            String formattedDate = seoulTime.format(formatter); // 서울 시간대로 형식 변경

            String saveDate = getDate();


            // 추가 중
            String MongoDB_IP = "j9a302.p.ssafy.io"; // 몽고DB IP
            int MongoDB_PORT = 27017; // 사용 포트
            String DB_NAME = "danchu"; // DB 명
            String ID = "hca"; // root ID
            String PASSWORD = "danchu1213!"; // root PW
            String Collection_NAME = "daily_keyword.history";
            int rank = 1;

            ConnectionString connectionString = new ConnectionString("mongodb://"+ID+":"+PASSWORD+"@"+MongoDB_IP+":"+MongoDB_PORT+"/");

            // MongoClient 설정
            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .build();

            // MongoClient 생성
            MongoClient mongoClient = MongoClients.create(settings);

            // DB 선택
            MongoDatabase database = mongoClient.getDatabase(DB_NAME);

            // Collection 선택
            MongoCollection<Document> collection = database.getCollection(Collection_NAME);

            while (!pq.isEmpty()) {
                Entry<Text, Integer> entry = pq.poll();

                // MongoDB 삽입
                Document document = new Document("keyword", entry.getKey().toString())
                        .append("frequency", entry.getValue())
                        .append("rank", rank++)
                        .append("date", saveDate)
                        .append("created_at", formattedDate)
                        .append("modified_at", formattedDate);
                collection.insertOne(document);
            }

            mongoClient.close();
//                context.write(entry.getKey(), new IntWritable(entry.getValue()));
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();

        ZoneId seoulZone = ZoneId.of("Asia/Seoul");
        ZonedDateTime seoulTime = LocalDateTime.now().atZone(seoulZone);

        DateTimeFormatter saveFormatter = DateTimeFormatter.ofPattern("yyyyMMdd"); // 날짜 포맷
        String saveDate = seoulTime.format(saveFormatter);

//        ZoneId seoulZone = ZoneId.of("Asia/Seoul"); // 서울 시간대 설정
//        ZonedDateTime seoulTime = ZonedDateTime.now(seoulZone); // 현재 서울 시간 얻기
//
//        DateTimeFormatter saveFormatter = DateTimeFormatter.ofPattern("yyyyMMdd"); // 날짜 포맷
//        String saveDate = seoulTime.format(saveFormatter);

//        String saveDate = getDate();

        if (otherArgs.length != 2) {
            System.err.println("Usage: <in> <out>");
            System.exit(2);
        }

        FileSystem hdfs = FileSystem.get(conf);
        Path output = new Path("/"+otherArgs[1]+saveDate);
        if (hdfs.exists(output))
            hdfs.delete(output, true);

        Job job = new Job(conf, "word count");
        job.setJarByClass(Wordcount.class);
        job.setMapperClass(TokenizerMapper.class);
        job.setReducerClass(IntSumReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
//        FileInputFormat.addInputPath(job, new Path(otherArgs[0]+saveDate)); // 파이썬에서 이 형식으로 텍스트를 저장
//        FileOutputFormat.setOutputPath(job, new Path(+saveDate));
        FileInputFormat.addInputPath(job, new Path("/"+otherArgs[0]+saveDate+".txt"));
        FileOutputFormat.setOutputPath(job, new Path(otherArgs[1]+saveDate));
        FileOutputFormat.setOutputPath(job, output);
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}