def split_text_file(input_file, output_prefix, max_size=None, max_lines=None):
    with open(input_file, 'r', encoding='utf-8') as infile:
        if max_size is not None:
            max_size *= 1024 * 1024  # 용량을 메가바이트로 변환

        current_size = 0
        current_lines = 0
        part_num = 1
        output_file = f"{output_prefix}_part{part_num}.txt"

        with open(output_file, 'w', encoding='utf-8') as outfile:
            for line in infile:
                line_size = len(line.encode('utf-8'))
                if (max_size is not None and current_size + line_size > max_size) or \
                   (max_lines is not None and current_lines >= max_lines):
                    outfile.close()
                    part_num += 1
                    output_file = f"{output_prefix}_part{part_num}.txt"
                    outfile = open(output_file, 'w', encoding='utf-8')
                    current_size = 0
                    current_lines = 0
                
                outfile.write(line)
                current_size += line_size
                current_lines += 1

if __name__ == "__main__":
    file_name = "all_form_2020" # 파일 이름 여기에 입력
    input_file = f'C:/Users/SSAFY/Desktop/A302/NewsData/{file_name}.txt'  # 입력 파일명을 적절하게 변경하세요.
    output_prefix = f'C:/Users/SSAFY/Desktop/A302/NewsData/{file_name}'  # 출력 파일명의 접두사를 적절하게 변경하세요.
    max_size = 512  # 파일 크기 제한을 메가바이트 단위로 설정하세요. None으로 설정하면 파일 크기 제한이 없습니다.
    max_lines = None  # 파일 라인 수 제한을 설정하세요. None으로 설정하면 라인 수 제한이 없습니다.

    split_text_file(input_file, output_prefix, max_size, max_lines)