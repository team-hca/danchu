def merge_text_files(input_files, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for input_file in input_files:
            with open(input_file, 'r', encoding='utf-8') as infile:
                outfile.write(infile.read())

if __name__ == "__main__":
    # 병합할 입력 파일 목록
    input_files = []
    file_directory = "C:/Users/SSAFY/Desktop/A302/ExtractNews/"
    file_name = "all_form_2009_to_2018"
    file_num = 20

    for i in range(1, file_num+1) :
        input_file = f'{file_directory}extract_{file_name}_part{i}.txt'
        input_files.append(input_file)

    # 결과를 저장할 출력 파일
    output_file = f'{file_directory}merge_{file_name}.txt'

    merge_text_files(input_files, output_file)